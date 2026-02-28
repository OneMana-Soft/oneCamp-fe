// Custom hook for managing animation state
import {useCallback, useEffect, useRef, useState} from "react";

export const useAnimationState = () => {
    const [animatingSubtasks, setAnimatingSubtasks] = useState<Set<string>>(new Set())
    const animationTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

    const triggerAnimation = useCallback((task_uuid: string) => {
        // Clear any existing timeout for this myTask
        const existingTimeout = animationTimeoutsRef.current.get(task_uuid)
        if (existingTimeout) {
            clearTimeout(existingTimeout)
        }

        // Add to animating set
        setAnimatingSubtasks(prev => new Set(prev).add(task_uuid))

        // Remove from animating set after animation completes
        const timeout = setTimeout(() => {
            setAnimatingSubtasks(prev => {
                const newSet = new Set(prev)
                newSet.delete(task_uuid)
                return newSet
            })
            animationTimeoutsRef.current.delete(task_uuid)
        }, 1200) // Animation duration

        animationTimeoutsRef.current.set(task_uuid, timeout)
    }, [])

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
            animationTimeoutsRef.current.clear()
        }
    }, [])

    return { animatingSubtasks, triggerAnimation }
}