"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface TouchableDivProps {
    onTouch?: () => void
    onClick?: () => void
    className?: string
    children?: React.ReactNode
    rippleBrightness?: number // 1.2 = 20% brighter, 0.8 = 20% darker
    rippleDuration?: number // in milliseconds
}

export default function TouchableDiv({
                                         onTouch,
                                         onClick,
                                         className = "",
                                         children,
                                         rippleBrightness = 1.2, // default to 20% brighter
                                         rippleDuration = 600, // default to 600ms
                                     }: TouchableDivProps) {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
    const divRef = useRef<HTMLDivElement>(null)
    const rippleIdRef = useRef(0)
    // Clean up completed ripples
    useEffect(() => {
        if (ripples.length > 0) {
            const timer = setTimeout(() => {
                setRipples([])
                if (onTouch) onTouch()
            }, rippleDuration)

            return () => clearTimeout(timer)
        }
    }, [ripples, rippleDuration, onTouch])

    const handleTouch = (event: React.TouchEvent) => {
        if (!divRef.current) return

        if ((event.target as HTMLElement).closest("[data-no-ripple]")) {
            return
        }

        // Get the position relative to the div
        const rect = divRef.current.getBoundingClientRect()
        const x = event.touches[0].clientX - rect.left
        const y = event.touches[0].clientY - rect.top

        // Add new ripple
        const newRipple = {
            id: rippleIdRef.current++,
            x,
            y,
        }

        setRipples([newRipple])
    }

    return (
        <div
            ref={divRef}
            className={`relative overflow-hidden cursor-pointer ${className}`}
            onTouchStart={handleTouch}
            onClick={onClick}
        >
            {children}

            {/* Ripple elements */}
            {ripples.map((ripple) => (
                <div
                    key={ripple.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: "10px",
                        height: "10px",
                        transform: "translate(-50%, -50%)",
                        background: `currentColor`,
                        opacity: 0,
                        filter: `brightness(${rippleBrightness})`,
                        animation: `ripple ${rippleDuration}ms ease-out forwards`,
                    }}
                />
            ))}

            {/* Ripple animation */}
            <style jsx>{`
                @keyframes ripple {
                    0% {
                        opacity: 0.7;
                        width: 0;
                        height: 0;
                    }
                    100% {
                        opacity: 0;
                        width: ${divRef.current ? Math.max(divRef.current.clientWidth, divRef.current.clientHeight) * 2.5 : 1000}px;
                        height: ${divRef.current ? Math.max(divRef.current.clientWidth, divRef.current.clientHeight) * 2.5 : 1000}px;
                    }
                }
            `}</style>
        </div>
    )
}