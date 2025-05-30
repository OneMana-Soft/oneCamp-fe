"use client"

import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils/cn";
import {X} from "lucide-react";
import {useRef, useState} from "react";

export function MobileHomeSearchBar() {

    const searchRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState("") // State to track input value

    // Handle clearing the input
    const handleClear = () => {
        setInputValue("")
        searchRef.current?.focus()
    }

    return (

            <div className='relative w-full flex justify-center items-center'>
                <Input
                    ref={searchRef}
                    type="search"
                    placeholder="Search..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={cn(
                        "h-10 w-[90vw] pl-4 pr-10", // Increased right padding for custom icon
                        " placeholder:text-zinc-500",
                        "rounded-full shadow-sm bg-secondary",
                        "focus-visible:ring-1 focus-visible:ring-zinc-500",
                        "transition-colors",
                        "[&::-webkit-search-cancel-button]:appearance-none" // Hide default clear icon
                    )}
                />
                {/* Custom Clear Icon */}
                {inputValue && (
                    <div
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 text-zinc-500 hover:cursor-pointer"
                    >
                        <X className="h-4 w-4" /> {/* Custom icon */}
                    </div>
                )}
            </div>

    );
}