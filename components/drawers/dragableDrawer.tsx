"use client"

import type React from "react"
import { useEffect } from "react"
import { motion, useAnimation, type PanInfo } from "framer-motion"

interface DraggableDrawerProps {
    children: React.ReactNode
    initialHeight?: number
    isExpanded: boolean
    setIsExpanded: (isExpanded: boolean) => void
}

const DraggableDrawer: React.FC<DraggableDrawerProps> = ({
                                                             children,
                                                             initialHeight = 200,
                                                             isExpanded,
                                                             setIsExpanded,
                                                         }) => {
    const controls = useAnimation()

    // Handle height changes based on expanded state
    useEffect(() => {
        controls.start(
            { height: isExpanded ? "100vh" : Math.min(initialHeight, window.innerHeight) },
            { duration: 0.3 }
        )
    }, [isExpanded, initialHeight, controls])

    // Reset height when not expanded
    useEffect(() => {
        if (!isExpanded) {
            controls.set({ height: Math.min(initialHeight, window.innerHeight) })
        }
    }, [isExpanded, initialHeight, controls])

    // Handle drag end to determine if the drawer should expand or collapse
    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        const threshold = window.innerHeight * 0.02 // 20% of screen height
        if (info.offset.y < -threshold) {
            setIsExpanded(true)
        } else if (info.offset.y > threshold) {
            setIsExpanded(false)
        } else {
            controls.start(
                { height: isExpanded ? "100vh" : initialHeight },
                { duration: 0.3 }
            )
        }
    }

    // Handle dragging to animate in both directions
    const handleDrag = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        // Calculate the new height based on the drag direction
        const currentHeight = isExpanded ? window.innerHeight : initialHeight
        const dragOffset = info.offset.y
        const newHeight = currentHeight - dragOffset

        // Ensure the height stays within bounds (initialHeight to 100vh)
        const constrainedHeight = Math.min(
            Math.max(newHeight, initialHeight),
            window.innerHeight
        )

        // Update the height in real-time
        controls.start({ height: constrainedHeight }, { duration: 0 })
    }

    return (
        <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0}
            dragMomentum={false}
            style={{ zIndex: 41 }}
            onDrag={handleDrag} // Real-time height adjustment during drag
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ height: initialHeight }}
            className="fixed bottom-0 left-0 border-t right-0  rounded-t-3xl opacity-100 bg-gray-50 dark:bg-gray-900 top-shadow "
        >
            <div className="w-full h-4">
                <div className="mx-auto mt-4 h-1.5 w-[100px] rounded-full bg-gray-400"></div>
            </div>
            <div
                className="overflow-y-auto p-1"
                style={{ height: "calc(100% - 10px)" }}
            >
                {children}
            </div>
        </motion.div>
    )
}

export default DraggableDrawer