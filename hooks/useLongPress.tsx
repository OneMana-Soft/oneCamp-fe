"use client";

import type React from "react";
import { useCallback, useEffect, useRef } from "react";

interface LongPressOptions {
    threshold?: number;
    onLongPressStart?: () => void;
    onLongPressEnd?: () => void;
    onLongPressProgress?: (progress: number) => void;
}

export function useLongPress(
    callback: () => void,
    {
        threshold = 500,
        onLongPressStart,
        onLongPressEnd,
        onLongPressProgress,
    }: LongPressOptions = {},
) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const targetRef = useRef<HTMLElement | null>(null);

    const start = useCallback(
        (event: React.TouchEvent | React.MouseEvent | TouchEvent) => {
            if (event.type === "touchstart") {
                event.preventDefault(); // This will work with passive: false
            }

            onLongPressStart?.();
            startTimeRef.current = Date.now();

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }

            if (onLongPressProgress) {
                progressIntervalRef.current = setInterval(() => {
                    const elapsed = Date.now() - startTimeRef.current;
                    const progress = Math.min(elapsed / threshold, 1);
                    onLongPressProgress(progress);

                    if (progress >= 1) {
                        clearInterval(progressIntervalRef.current!);
                    }
                }, 16); // ~60fps
            }

            timeoutRef.current = setTimeout(() => {
                callback();
            }, threshold);
        },
        [callback, threshold, onLongPressStart, onLongPressProgress],
    );

    const stop = useCallback(
        (event?: React.TouchEvent | React.MouseEvent | TouchEvent) => { // eslint-disable-line @typescript-eslint/no-unused-vars
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }

            onLongPressEnd?.();
        },
        [onLongPressEnd],
    );

    // Attach native event listeners with passive: false
    useEffect(() => {
        const element = targetRef.current;
        if (!element) return;

        const handleTouchStart = (e: TouchEvent) => start(e);
        const handleTouchEnd = (e: TouchEvent) => stop(e);

        element.addEventListener("touchstart", handleTouchStart, {
            passive: false,
        });
        element.addEventListener("touchend", handleTouchEnd, { passive: false });

        return () => {
            element.removeEventListener("touchstart", handleTouchStart);
            element.removeEventListener("touchend", handleTouchEnd);
        };
    }, [start, stop]);

    return {
        ref: targetRef, // Attach this ref to your target element
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
    };
}
