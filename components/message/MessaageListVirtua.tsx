"use client"

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { SeparatorPill } from "@/components/separator/separatorPill"
import { debounceUtil } from "@/lib/utils/debounce"
import type { VirtualizedListProps } from "@/types/virtual"
import { Virtualizer } from "virtua"
import { cn } from "@/lib/utils/cn"
import {Button} from "@/components/ui/button";
import {ChevronDown} from "lucide-react";

export const MessageListVirtua = <T,>({
                                          items,
                                          renderItem,
                                          getDateHeading,
                                          containerClassName = "relative h-full",
                                          fetchOlderMessage,
                                          olderMessageLoading,
                                          hasOldMessage = true,
                                          fetchNewMessage,
                                          newMessageLoading,
                                          virtualShift,
                                            clickedScrollToBottom,
                                          hasNewMessage = true,
                                          ref,
                                      }: VirtualizedListProps<T>) => {
    const initiallyScrolledToBottom = useRef(false)
    const [visibleDateIndex, setVisibleDateIndex] = useState<number>(-1)
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true) // New state


    const dateKeys = useMemo(() => items.filter((item) => item.type === "separator").map((item) => item.date!), [items])

    const separatorItems = useMemo(
        () => items.map((item, index) => ({ item, index })).filter(({ item }) => item.type === "separator"),
        [items],
    )

    const scrollToBottom = useCallback(() => {
        if (!ref.current || items.length === 0) return

        clickedScrollToBottom()
        // ref.current.scrollToIndex(items.length - 1, {
        //     align: "end",
        //     smooth: true,
        // })
    }, [ref, items.length])

    const calculateVisibleDateIndex = useCallback(() => {
        if (!ref.current || dateKeys.length === 0) return -1

        const virtualizer = ref.current
        const startIndex = virtualizer.findStartIndex()
        const endIndex = virtualizer.findEndIndex()

        // If scrolled to the top, hide the separator pill
        if (startIndex <= 0) return -1

        if (startIndex === -1 || endIndex === -1) return visibleDateIndex

        let newVisibleIndex = -1

        // Find the first separator within the rendered range
        for (let i = 0; i < separatorItems.length; i++) {
            const separatorIndex = separatorItems[i].index

            // Check if separator is within the visible rendered range
            if (separatorIndex >= startIndex && separatorIndex <= endIndex) {
                newVisibleIndex = i - 1
                break
            }

            // If we've passed the rendered range, use the previous separator
            if (separatorIndex > endIndex && i > 0) {
                newVisibleIndex = i - 1
                break
            }
        }

        // Fallback: find the closest separator before the rendered range
        if (newVisibleIndex === -1 && separatorItems.length > 0) {
            for (let i = separatorItems.length - 1; i >= 0; i--) {
                const separatorIndex = separatorItems[i].index

                if (separatorIndex <= startIndex) {
                    newVisibleIndex = i
                    break
                }
            }
        }

        return newVisibleIndex
    }, [ref, dateKeys.length, separatorItems, visibleDateIndex])

    const updateVisibleDateIndex = useCallback(() => {
        const newIndex = calculateVisibleDateIndex()
        setVisibleDateIndex(newIndex)
    }, [calculateVisibleDateIndex])

    const debouncedUpdateVisibleDateIndex = useMemo(
        () => debounceUtil(updateVisibleDateIndex, 100),
        [updateVisibleDateIndex],
    )

    useLayoutEffect(() => {
        if (!ref.current || items.length === 0) return;
        const virtualizer = ref.current;
        const scrollSize = virtualizer.scrollSize;
        const viewportSize = virtualizer.viewportSize;

        // If content does not overflow, fetch older and/or new messages
        if (scrollSize <= viewportSize) {
            if (hasOldMessage && !olderMessageLoading) {
                fetchOlderMessage();
            }
            if (hasNewMessage && !newMessageLoading) {
                fetchNewMessage();
            }
        }
    }, [items, ref, hasOldMessage, hasNewMessage, olderMessageLoading, newMessageLoading, fetchOlderMessage, fetchNewMessage]);


    useLayoutEffect(() => {
        if (!ref.current ||  items.length == 0|| initiallyScrolledToBottom.current ) return

        initiallyScrolledToBottom.current = true

        requestAnimationFrame(() => {
            if (ref.current) {
                ref.current.scrollToIndex(items.length - 1, {
                })
            }
            setIsScrolledToBottom(true) // Set to true on initial scroll to bottom

        })
    }, [items.length, ref])

    return (
        <div
            className={cn(containerClassName, "touch-pan-y")}
            style={{
                overflowY: "auto", overflowAnchor: "none", WebkitOverflowScrolling: "touch", touchAction: "pan-y"
            }}
        >
            {visibleDateIndex > -1 && items.length > 2 && (
                <SeparatorPill
                    className="sticky top-1 z-10 transition-opacity duration-200"
                    lineClassName="bg-transparent"
                    pillClassName="border-2 bg-background"
                >
                    {getDateHeading(dateKeys[visibleDateIndex])}
                </SeparatorPill>
            )}
            <Virtualizer
                ref={ref}
                shift={virtualShift}
                onScroll={(offset) => {
                    if (!initiallyScrolledToBottom.current || !ref.current) return

                    // Check if scrolled to bottom
                    const isAtBottom = offset >= ref.current.scrollSize - ref.current.viewportSize - 300 // Small threshold
                    setIsScrolledToBottom(isAtBottom)

                    // Hide separator pill when scrolled to the top
                    if (offset < 20) {
                        setVisibleDateIndex(-1)
                    } else {
                        debouncedUpdateVisibleDateIndex()
                    }

                    if (offset < 200 && !olderMessageLoading && hasOldMessage) {
                        fetchOlderMessage()
                    }

                    if (
                        offset - ref.current.scrollSize + ref.current.viewportSize >= -200 &&
                        hasNewMessage &&
                        !newMessageLoading
                    ) {
                        fetchNewMessage()
                    }
                }}
            >
                {/* Loading indicator for older messages */}
                {olderMessageLoading && (
                    <div className="flex justify-center py-2">
                        <span className="text-sm text-muted-foreground">Loading older messages...</span>
                    </div>
                )}

                {items.map((item) => {
                    return (
                        <div key={item.key}>
                            {item.type === "separator" ? (
                                <SeparatorPill pillClassName="border-2 bg-background">{getDateHeading(item.date!)}</SeparatorPill>
                            ) : (
                                renderItem(item.data!)
                            )}
                        </div>
                    )
                })}
            </Virtualizer>

            {!isScrolledToBottom && (
                <Button className="sticky bottom-8 float-right mr-8 z-10 rounded-full" onClick={scrollToBottom} size="icon">
                    <ChevronDown />
                </Button>
            )}
        </div>
    )
}

MessageListVirtua.displayName = "MessageListVirtua"
