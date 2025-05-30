"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils/cn"
import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react" // Import a custom icon (e.g., from lucide-react)

export default function DesktopNavigationSearch() {
    const searchRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState("") // State to track input value

    // Handle keyboard shortcut to focus the input
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault()
                searchRef.current?.focus()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])

    // Handle clearing the input
    const handleClear = () => {
        setInputValue("")
        searchRef.current?.focus()
    }

    return (
        <div className="w-full max-w-[500px] px-4">
            <div className="relative">
                <Input
                    ref={searchRef}
                    type="search"
                    placeholder="Global Search..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={cn(
                        "h-10 w-full pl-4 pr-32", // Increased right padding for custom icon
                        "text-sm placeholder:text-zinc-500",
                        "rounded-lg shadow-sm",
                        "focus-visible:ring-1 focus-visible:ring-zinc-500",
                        "transition-colors",
                        "[&::-webkit-search-cancel-button]:appearance-none" // Hide default clear icon
                    )}
                />
                {/* Custom Clear Icon */}
                {inputValue && (
                    <div
                        onClick={handleClear}
                        className="absolute right-24 top-1/2 -translate-y-1/2 transform rounded p-1 text-zinc-500 hover:cursor-pointer"
                    >
                        <X className="h-4 w-4" /> {/* Custom icon */}
                    </div>
                )}
                {/* Keyboard Shortcut Hint */}
                <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transform">
                    <span className="inline-flex h-6 select-none items-center gap-1 rounded border border-secondary-foreground-1 text-muted-foreground px-1.5 font-mono text-sm">
                        {navigator?.platform?.toLowerCase()?.includes("mac") ? "⌘" : "Ctrl"} K
                    </span>
                </kbd>
            </div>
        </div>
    )
}