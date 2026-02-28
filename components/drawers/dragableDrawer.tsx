"use client"

import type React from "react"
import { useEffect } from "react"
import { motion, useAnimation, useDragControls, type PanInfo } from "framer-motion"

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
    const dragControls = useDragControls()

    // Handle height changes based on expanded state and initialHeight updates
    useEffect(() => {
        const targetHeight = isExpanded ? "100vh" : Math.min(initialHeight, window.innerHeight);
        
        // We use a quick animation when adjusting for text (initialHeight), 
        // and standard animation for expanding.
        controls.start(
            { height: targetHeight },
            { duration: 0.2, ease: "easeOut" }
        )
    }, [isExpanded, initialHeight, controls])

    // Handle drag end to determine if the drawer should expand or collapse
    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        const thresholdDistance = window.innerHeight * 0.2 // 20% of screen height
        const thresholdVelocity = 500 // minimum velocity to count as a flick
        
        // Check for quick flick or passing the distance threshold
        if (info.offset.y < -thresholdDistance || info.velocity.y < -thresholdVelocity) {
            setIsExpanded(true)
        } else if (info.offset.y > thresholdDistance || info.velocity.y > thresholdVelocity) {
            setIsExpanded(false)
        } else {
            // Snap back to current state
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

        // Update the height in real-time smoothly
        controls.set({ height: constrainedHeight })
    }

    return (
        <motion.div
            drag="y"
            dragControls={dragControls}
            dragListener={false}
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
            <div 
                className="w-full py-3 flex justify-center items-center cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <div className="h-1.5 w-[100px] rounded-full bg-gray-400"></div>
            </div>
            <div
                className="overflow-y-auto p-1 pt-0"
                style={{ height: "calc(100% - 30px)" }}
            >
                {children}
            </div>
        </motion.div>
    )
}

export default DraggableDrawer