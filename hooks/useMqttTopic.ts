"use client"

import { useEffect, useRef, useState } from "react"
import {useMqtt} from "@/components/mqtt/mqttProvider";

interface UseMqttTopicOptions {
    topic: string
    onMessage?: (message: string, topic: string) => void
    autoSubscribe?: boolean
}

export const useMqttTopic = ({ topic, onMessage, autoSubscribe = true }: UseMqttTopicOptions) => {
    const { subscribeToTopic, unsubscribeFromTopic, connectionState } = useMqtt()
    const [messages, setMessages] = useState<Array<{ message: string; timestamp: number }>>([])
    const subscriptionIdRef = useRef<string | null>(null)

    const handleMessage = (message: string, receivedTopic: string) => {
        if (receivedTopic === topic) {
            setMessages((prev) => [...prev, { message, timestamp: Date.now() }])
            onMessage?.(message, receivedTopic)
        }
    }

    useEffect(() => {
        // Only subscribe if:
        // 1. Topic is available
        // 2. Auto-subscribe is enabled
        // 3. Not already subscribed
        // 4. MQTT client is connected
        if (topic && autoSubscribe && !subscriptionIdRef.current && connectionState.isConnected) {
            subscriptionIdRef.current = subscribeToTopic(topic, handleMessage)
        }

        return () => {
            if (subscriptionIdRef.current) {
                unsubscribeFromTopic(subscriptionIdRef.current)
                subscriptionIdRef.current = null
            }
        }
    }, [topic, autoSubscribe, subscribeToTopic, unsubscribeFromTopic, connectionState.isConnected])

    const subscribe = () => {
        if (topic && !subscriptionIdRef.current) {
            subscriptionIdRef.current = subscribeToTopic(topic, handleMessage)
        }
    }

    const unsubscribe = () => {
        if (subscriptionIdRef.current) {
            unsubscribeFromTopic(subscriptionIdRef.current)
            subscriptionIdRef.current = null
        }
    }

    const clearMessages = () => {
        setMessages([])
    }

    return {
        messages,
        subscribe,
        unsubscribe,
        clearMessages,
        isSubscribed: !!subscriptionIdRef.current,
        isConnected: connectionState.isConnected,
    }
}
