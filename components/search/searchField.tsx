import {Search, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils/helpers/cn";
import {Button} from "@/components/ui/button";
import {useCallback, useRef, useState} from "react";
import {sanitizeFilterQuery} from "@/lib/utils/sanitizeFilterQuery";

interface SearchFieldProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;

}
export const SearchField: React.FC<SearchFieldProps> = ({placeholder, value, onChange}) => {
    const searchRef = useRef<HTMLInputElement>(null)
    const handleClear = () => {
        onChange("")
        searchRef.current?.focus()

    }


    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = sanitizeFilterQuery(e.target.value)
        onChange(sanitized)
    }, [])



    return (
        <div className="relative flex justify-center items-center">
            <div className="absolute left-3 bottom-[2] md:bottom-[6] -translate-y-1/2 transform text-zinc-500">
                <Search className="h-5 w-5"/> {/* Magnifying glass icon */}
            </div>
            <Input
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className={cn(
                    "h-10 md:h-12 w-full pl-10 border-r-0 border-l-0 pr-10 rounded-none pb-2 pt-2", // Increased font size and left padding for the icon
                    "placeholder:text-zinc-500",
                    "shadow-sm",
                    "focus-visible:ring-0 focus-visible:ring-zinc-500",
                    "transition-colors",
                    "[&::-webkit-search-cancel-button]:appearance-none" // Hide default clear icon
                )}
                ref={searchRef}
            />
            {value && (
                <Button
                    variant='secondary'
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 !h-6  -translate-y-1/2 transform rounded p-1 text-zinc-500 hover:cursor-pointer"
                >
                    <X className="h-4 w-4"/> {/* Custom clear icon */}
                </Button>
            )}
        </div>
    )
}