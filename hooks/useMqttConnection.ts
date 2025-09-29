"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import mqtt, { type MqttClient, type ISubscriptionMap } from "mqtt"
import {ConnectionConfig, mqttConfigRes, MqttConnectionState} from "@/types/mqtt";

interface UseMqttConnectionProps {
    config: mqttConfigRes | null
    connectionConfig: ConnectionConfig
    onMessage?: (topic: string, message: Buffer) => void
    onConnect?: () => void
    onDisconnect?: () => void
    onError?: (error: Error) => void
    dynamicTopicManager?: {
        getTopicsToSubscribe: () => string[]
        subscribeToTopic: (topic: string) => void
        unsubscribeFromTopic: (topic: string) => void
    }
}

export const useMqttConnection = ({
                                      config,
                                      connectionConfig,
                                      onMessage,
                                      onConnect,
                                      onDisconnect,
                                      onError,
                                      dynamicTopicManager,
                                  }: UseMqttConnectionProps) => {
    const [connectionState, setConnectionState] = useState<MqttConnectionState>({
        isConnected: false,
        isConnecting: false,
        error: null,
        reconnectAttempts: 0,
    })

    const clientRef = useRef<MqttClient | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isManualDisconnect = useRef(false)

    const clearReconnectTimeout = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
            reconnectTimeoutRef.current = null
        }
    }, [])

    const updateConnectionState = useCallback(
        (updates: Partial<MqttConnectionState> | ((prev: MqttConnectionState) => Partial<MqttConnectionState>)) => {
            setConnectionState((prev) => {
                const newUpdates = typeof updates === "function" ? updates(prev) : updates
                return { ...prev, ...newUpdates }
            })
        },
        [],
    )

    const handleConnect = useCallback(() => {
        console.log("[MQTT] Connected successfully")
        updateConnectionState({
            isConnected: true,
            isConnecting: false,
            error: null,
            reconnectAttempts: 0,
        })
        onConnect?.()
    }, [onConnect, updateConnectionState])

    const handleDisconnect = useCallback(() => {
        console.log("[MQTT] Disconnected")
        updateConnectionState({
            isConnected: false,
            isConnecting: false,
        })
        onDisconnect?.()

        if (!isManualDisconnect.current) {
            updateConnectionState((prev) => {
                if (prev.reconnectAttempts < connectionConfig.maxReconnectAttempts) {
                    const delay = Math.min(1000 * Math.pow(2, prev.reconnectAttempts), 30000)
                    console.log(`[MQTT] Reconnecting in ${delay}ms (attempt ${prev.reconnectAttempts + 1})`)

                    reconnectTimeoutRef.current = setTimeout(() => {
                        updateConnectionState({
                            reconnectAttempts: prev.reconnectAttempts + 1,
                            isConnecting: true,
                        })
                        // Connect function will be defined later
                    }, delay)
                }
                return {}
            })
        }
    }, [connectionConfig.maxReconnectAttempts, onDisconnect, updateConnectionState])

    const handleError = useCallback(
        (error: Error) => {
            console.error("[MQTT] Connection error:", error)
            updateConnectionState({
                error: error.message,
                isConnecting: false,
            })
            onError?.(error)
        },
        [onError, updateConnectionState],
    )

    const handleMessage = useCallback(
        (topic: string, message: Buffer) => {
            try {
                onMessage?.(topic, message)
            } catch (error) {
                console.error("[MQTT] Message handling error:", error)
                onError?.(error as Error)
            }
        },
        [onMessage, onError],
    )

    const subscribeToTopics = useCallback(
        (client: MqttClient, topics: string[]) => {
            if (!topics.length) return

            const subscriptions: ISubscriptionMap = {}
            topics.forEach((topic) => {
                subscriptions[topic] = { qos: 0 }
            })

            client.unsubscribe(topics, (err) => {
                if (err) {
                    console.warn("[MQTT] Unsubscribe warning:", err)
                }
            })

            client.subscribe(subscriptions, (err) => {
                if (err) {
                    console.error("[MQTT] Subscribe error:", err)
                    handleError(new Error(`Failed to subscribe: ${err.message}`))
                } else {
                    console.log("[MQTT] Successfully subscribed to topics:", topics)
                }
            })
        },
        [handleError],
    )

    const subscribeToTopic = useCallback(
        (topic: string) => {
            if (!clientRef.current || !connectionState.isConnected) {
                console.warn("[MQTT] Cannot subscribe - client not connected")
                return
            }

            clientRef.current.subscribe(topic, { qos: 0 }, (err) => {
                if (err) {
                    console.error("[MQTT] Dynamic subscribe error:", err)
                    handleError(new Error(`Failed to subscribe to ${topic}: ${err.message}`))
                } else {
                    console.log("[MQTT] Successfully subscribed to topic:", topic)
                }
            })
        },
        [connectionState.isConnected, handleError],
    )

    const unsubscribeFromTopic = useCallback((topic: string) => {
        if (!clientRef.current) {
            console.warn("[MQTT] Cannot unsubscribe - client not available")
            return
        }

        clientRef.current.unsubscribe(topic, (err) => {
            if (err) {
                console.error("[MQTT] Dynamic unsubscribe error:", err)
            } else {
                console.log("[MQTT] Successfully unsubscribed from topic:", topic)
            }
        })
    }, [])

    const connect = useCallback(() => {
        if (!config || connectionState.isConnecting || connectionState.isConnected) {
            return
        }

        try {
            updateConnectionState({ isConnecting: true, error: null })
            isManualDisconnect.current = false

            const client = mqtt.connect(connectionConfig.wsUrl, {
                clientId: config.clientId,
                username: config.username,
                password: config.password,
                clean: true,
                path: "/mqtt",
                port: connectionConfig.wsPort,
                keepalive: 60,
                connectTimeout: 30000,
                reconnectPeriod: 0, // We handle reconnection manually
            })

            client.on("connect", handleConnect)
            client.on("close", handleDisconnect)
            client.on("error", handleError)
            client.on("message", handleMessage)

            client.on("connect", () => {
                subscribeToTopics(client, config.topics)
            })

            clientRef.current = client
        } catch (error) {
            handleError(error as Error)
        }
    }, [
        config,
        connectionState.isConnecting,
        connectionState.isConnected,
        connectionConfig,
        handleConnect,
        handleDisconnect,
        handleError,
        handleMessage,
        subscribeToTopics,
        updateConnectionState,
    ])

    const disconnect = useCallback(() => {
        isManualDisconnect.current = true
        clearReconnectTimeout()

        if (clientRef.current) {
            clientRef.current.end(true)
            clientRef.current = null
        }

        updateConnectionState({
            isConnected: false,
            isConnecting: false,
            reconnectAttempts: 0,
        })
    }, [clearReconnectTimeout, updateConnectionState])

    const publish = useCallback(
        (topic: string, message: string, options = { qos: 0 as const }) => {
            return new Promise<void>((resolve, reject) => {
                if (!clientRef.current || !connectionState.isConnected) {
                    reject(new Error("MQTT client not connected"))
                    return
                }

                clientRef.current.publish(topic, message, options, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            })
        },
        [connectionState.isConnected],
    )

    useEffect(() => {
        if (config && !connectionState.isConnected && !connectionState.isConnecting) {
            connect()
        }
    }, [config, connectionState.isConnected, connectionState.isConnecting, connect])

    useEffect(() => {
        return () => {
            clearReconnectTimeout()
            if (clientRef.current) {
                isManualDisconnect.current = true
                clientRef.current.end(true)
            }
        }
    }, [clearReconnectTimeout])

    // Define connect function after its usage
    const connectFunction = useCallback(() => {
        if (!config || connectionState.isConnecting || connectionState.isConnected) {
            return
        }

        try {
            updateConnectionState({ isConnecting: true, error: null })
            isManualDisconnect.current = false

            const client = mqtt.connect(connectionConfig.wsUrl, {
                clientId: config.clientId,
                username: config.username,
                password: config.password,
                clean: true,
                path: "/mqtt",
                port: connectionConfig.wsPort,
                keepalive: 60,
                connectTimeout: 30000,
                reconnectPeriod: 0, // We handle reconnection manually
            })

            client.on("connect", handleConnect)
            client.on("close", handleDisconnect)
            client.on("error", handleError)
            client.on("message", handleMessage)

            client.on("connect", () => {
                const configTopics = config.topics
                const dynamicTopics = dynamicTopicManager?.getTopicsToSubscribe() || []
                const allTopics = [...configTopics, ...dynamicTopics]
                subscribeToTopics(client, allTopics)
            })

            clientRef.current = client
        } catch (error) {
            handleError(error as Error)
        }
    }, [
        config,
        connectionState.isConnecting,
        connectionState.isConnected,
        connectionConfig,
        handleConnect,
        handleDisconnect,
        handleError,
        handleMessage,
        subscribeToTopics,
        updateConnectionState,
    ])

    return {
        connectionState,
        connect: connectFunction,
        disconnect,
        publish,
        client: clientRef.current,
        subscribeToTopic,
        unsubscribeFromTopic,
    }
}
