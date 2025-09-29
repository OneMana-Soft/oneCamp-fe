"use client"

import React, {useCallback, useMemo, useRef, useState} from "react"
import { createContext, useContext, useEffect } from "react"
import {useMqttConnection} from "@/hooks/useMqttConnection";
import {useMqttMessageHandler} from "@/hooks/useMqttMessageHandler";
import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserProfileInterface} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";
import {DynamicTopicManager, mqttConfigRes, MqttConnectionState, TopicSubscription} from "@/types/mqtt";
import {useDispatch, useSelector} from "react-redux";
import {updateUserConnectedDeviceCount} from "@/store/slice/userSlice";
import type {RootState} from "@/store/store";

interface MqttContextValue {
    connectionState: MqttConnectionState
    publish: (topic: string, message: string) => Promise<void>
    connect: () => void
    disconnect: () => void
    subscribeToTopic: (topic: string, callback: (message: string, topic: string) => void) => string
    unsubscribeFromTopic: (subscriptionId: string) => void
}


const MqttContext = createContext<MqttContextValue | null>(null)

export const useMqtt = () => {
    const context = useContext(MqttContext)
    if (!context) {
        throw new Error("useMqtt must be used within MqttProvider")
    }
    return context
}

interface MqttProviderProps {
    children: React.ReactNode
}

export const MqttProvider: React.FC<MqttProviderProps> = ({ children }) => {
    const connectionConfig = {
        wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8083",
        wsPort: process.env.NODE_ENV !== "development" ? 8084 : 8083,
        reconnectInterval: 1000,
        maxReconnectAttempts: 5,
        typingTimeout: 4000,
    }

    const dispatch = useDispatch();
    const mqttConfigRes = useFetch<mqttConfigRes>(GetEndpointUrl.GetMqttConfig);
    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)
    const userUuid = selfProfile.data?.data.user_uuid
    const userStatusState = useSelector((state: RootState) => state.users.usersStatus[userUuid||''] || []);

    const messageHandler = useMqttMessageHandler({
        connectionConfig,
        userUuid,
    })

    const [topicSubscriptions, setTopicSubscriptions] = useState<Map<string, TopicSubscription[]>>(new Map())
    const subscriptionIdCounter = useRef(0)

    const dynamicTopicManager: DynamicTopicManager = useMemo(
        () => ({
            subscriptions: topicSubscriptions,
            subscribe: (topic: string, callback: (message: string, topic: string) => void) => {
                const id = `sub_${++subscriptionIdCounter.current}`
                const subscription: TopicSubscription = { topic, callback, id }

                setTopicSubscriptions((prev) => {
                    const newMap = new Map(prev)
                    const existing = newMap.get(topic) || []
                    newMap.set(topic, [...existing, subscription])
                    return newMap
                })

                return id
            },
            unsubscribe: (subscriptionId: string) => {
                setTopicSubscriptions((prev) => {
                    const newMap = new Map(prev)
                    for (const [topic, subscriptions] of newMap.entries()) {
                        const filtered = subscriptions.filter((sub) => sub.id !== subscriptionId)
                        if (filtered.length === 0) {
                            newMap.delete(topic)
                        } else {
                            newMap.set(topic, filtered)
                        }
                    }
                    return newMap
                })
            },
            getTopicsToSubscribe: () => Array.from(topicSubscriptions.keys()),
        }),
        [topicSubscriptions],
    )

    const enhancedMessageHandler = useCallback(
        (topic: string, message: Buffer) => {
            // Call the original message handler
            messageHandler.handleMessage(topic, message)

            // Route to dynamic topic subscriptions
            const subscriptions = topicSubscriptions.get(topic)
            if (subscriptions) {
                const messageStr = message.toString()
                subscriptions.forEach((sub) => {
                    try {
                        sub.callback(messageStr, topic)
                    } catch (error) {
                        console.error("[MQTT] Dynamic subscription callback error:", error)
                    }
                })
            }
        },
        [messageHandler, topicSubscriptions],
    )

    const onConnect = () => {
        dispatch(updateUserConnectedDeviceCount({
            userUUID: userUuid || '',
            deviceConnected: userStatusState.deviceConnected + 1
        }))
        console.log("[MQTT] Provider connected")
    }

    const onDisconnect = () => {
        dispatch(updateUserConnectedDeviceCount({
            userUUID: userUuid || '',
            deviceConnected: userStatusState.deviceConnected-1
        }))
        console.log("[MQTT] Provider disconnected")
    }

    const {
        connectionState,
        connect,
        disconnect,
        publish,
        subscribeToTopic: mqttSubscribe,
        unsubscribeFromTopic: mqttUnsubscribe,
    } = useMqttConnection({
        config: mqttConfigRes.data || null,
        connectionConfig,
        onMessage: enhancedMessageHandler,
        onConnect: onConnect,
        onDisconnect: onDisconnect,
        onError: (error) => console.error("[MQTT] Provider error:", error),

    })

    const handleSubscribeToTopic = useCallback(
        (topic: string, callback: (message: string, topic: string) => void) => {
            const subscriptionId = dynamicTopicManager.subscribe(topic, callback)

            // If this is the first subscription to this topic, subscribe to MQTT
            const subscriptions = topicSubscriptions.get(topic)
            if (subscriptions && subscriptions.length === 1) {
                mqttSubscribe?.(topic)
            }

            return subscriptionId
        },
        [dynamicTopicManager, topicSubscriptions, mqttSubscribe],
    )

    const handleUnsubscribeFromTopic = useCallback(
        (subscriptionId: string) => {
            // Find the topic for this subscription
            let topicToCheck: string | null = null
            for (const [topic, subscriptions] of topicSubscriptions.entries()) {
                if (subscriptions.some((sub) => sub.id === subscriptionId)) {
                    topicToCheck = topic
                    break
                }
            }

            dynamicTopicManager.unsubscribe(subscriptionId)

            // If no more subscriptions for this topic, unsubscribe from MQTT
            if (topicToCheck && !topicSubscriptions.has(topicToCheck)) {
                mqttUnsubscribe?.(topicToCheck)
            }
        },
        [dynamicTopicManager, topicSubscriptions, mqttUnsubscribe],
    )

    useEffect(() => {
        return () => {
            messageHandler.cleanup()
        }
    }, [messageHandler])

    const contextValue: MqttContextValue = {
        connectionState,
        publish,
        connect,
        disconnect,
        subscribeToTopic: handleSubscribeToTopic,
        unsubscribeFromTopic: handleUnsubscribeFromTopic,
    }

    return <MqttContext.Provider value={contextValue}>{children}</MqttContext.Provider>
}
