"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {SearchableItem} from "@/types/search";

interface UseKeyboardNavigationProps<T extends SearchableItem> {
    items: T[]
    isOpen: boolean
    onSelect: (item: T) => void
    onClose: () => void
}

export function useKeyboardNavigation<T extends SearchableItem>({
                                                                    items,
                                                                    isOpen,
                                                                    onSelect,
                                                                    onClose,
                                                                }: UseKeyboardNavigationProps<T>) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    function handleKeyNavigation(e: React.KeyboardEvent) {
        if (!isOpen) return

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                setSelectedIndex((prev) => {
                    if (prev === null) return 0
                    return prev < items.length - 1 ? prev + 1 : prev
                })
                break
            case "ArrowUp":
                e.preventDefault()
                setSelectedIndex((prev) => {
                    if (prev === null) return items.length - 1
                    return prev > 0 ? prev - 1 : prev
                })
                break
            case "Enter":
                e.preventDefault()
                if (selectedIndex !== null && items[selectedIndex]) {
                    onSelect(items[selectedIndex])
                    setSelectedIndex(null) // Reset selection after selecting
                }
                break
            case "Escape":
                e.preventDefault()
                setSelectedIndex(null) // Reset selection when closing
                onClose()
                break
        }
    }

    // Reset selected index when dropdown closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedIndex(null)
        }
    }, [isOpen])

    // Reset if current selection is out of bounds when items change
    useEffect(() => {
        if (selectedIndex !== null && selectedIndex >= items.length) {
            setSelectedIndex(null)
        }
    }, [items.length, selectedIndex])

    return { selectedIndex, setSelectedIndex, handleKeyNavigation }
}
