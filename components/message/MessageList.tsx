// src/components/channel/MessageList.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { SeparatorPill } from "@/components/separator/separatorPill";
import {VirtualizedListProps} from "@/types/virtual";
import {debounceUtil} from "@/lib/utils/debounce";

const STICKY_HEADER_BUFFER = 0;
const OVERSCAN_COUNT = 15;
const ESTIMATED_ITEM_SIZE = 50;

export const MessageList = <T,>({
                                    items,
                                    renderItem,
                                    getDateHeading,
                                    containerClassName = "relative overflow-y-auto h-full",
                                }: VirtualizedListProps<T>) => {
    const [visibleDateIndex, setVisibleDateIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const dateKeys = items.filter((item) => item.type === "separator").map((item) => item.date!);

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => containerRef.current,
        estimateSize: useCallback(() => ESTIMATED_ITEM_SIZE, []),
        overscan: OVERSCAN_COUNT,
    });

    useEffect(() => {
        const updateVisibleDateIndex = () => {
            const scrollElement = containerRef.current;
            if (!scrollElement) return;

            const scrollTop = scrollElement.scrollTop;
            const viewportHeight = scrollElement.clientHeight;
            const visibleItems = virtualizer.getVirtualItems();

            if (!visibleItems.length) {
                setVisibleDateIndex(-1);
                return;
            }

            const firstSeparator = visibleItems.find((vi) => vi.index === 0);
            // Check if firstSeparator exists and its start is within the viewport
            if (firstSeparator && firstSeparator.start >= scrollTop && firstSeparator.start <= scrollTop + viewportHeight) {
                setVisibleDateIndex(-1);
                return;
            }

            let closestSeparatorIndex = -1;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type === "separator") {
                    const virtualItem = visibleItems.find((vi) => vi.index === i);
                    const itemPosition = virtualItem
                        ? virtualItem.start
                        : virtualizer.getTotalSize() * (i / items.length);
                    if (itemPosition <= scrollTop + STICKY_HEADER_BUFFER) {
                        closestSeparatorIndex = dateKeys.indexOf(items[i].date!);
                    } else if (itemPosition > scrollTop) {
                        break;
                    }
                }
            }
            setVisibleDateIndex(closestSeparatorIndex);
        };

        const scrollElement = containerRef.current;
        if (!scrollElement) return;

        const debouncedUpdate = debounceUtil(updateVisibleDateIndex, 50);
        scrollElement.addEventListener("scroll", debouncedUpdate);
        updateVisibleDateIndex();

        return () => scrollElement.removeEventListener("scroll", debouncedUpdate);
    }, [virtualizer, items, dateKeys]);

    if (!items.length) {
        return (
            <div
                className="flex items-center justify-center h-full text-muted-foreground"
                aria-label="No items available"
            >
                No messages available
            </div>
        );
    }

    return (
        <div ref={containerRef} className={containerClassName} role="log" aria-live="polite">
            {visibleDateIndex > -1 && (
                <SeparatorPill className="sticky top-1 z-10 transition-opacity duration-200 " lineClassName="bg-transparent" pillClassName='border-2 bg-background'>
                    {getDateHeading(dateKeys[visibleDateIndex])}
                </SeparatorPill>
            )}
            <div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
                {virtualizer.getVirtualItems().map((virtualItem) => {
                    const item = items[virtualItem.index];
                    return (
                        <div
                            key={virtualItem.key}
                            data-index={virtualItem.index}
                            ref={virtualizer.measureElement}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${virtualItem.start}px)`,
                            }}
                        >
                            {item.type === "separator" ? (
                                <SeparatorPill pillClassName='border-2 bg-background'>{getDateHeading(item.date!)}</SeparatorPill >
                            ) : (
                                renderItem(item.data!)
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

MessageList.displayName = "MessageList";