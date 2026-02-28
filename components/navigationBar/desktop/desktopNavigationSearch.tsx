"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils/helpers/cn"
import { useEffect, useRef, memo, useCallback } from "react"
import { X, Search, Loader2, Eye } from "lucide-react"
import { SearchResult } from "@/services/searchService"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSearch } from "@/hooks/useSearch"
import { getIcon, getHighlightedTitle, getContext, isResultPreviewable } from "@/lib/utils/helpers/search"

const SearchResultItem = memo(({ result, onClick, onPreview }: { result: SearchResult, onClick: (result: SearchResult) => void, onPreview: (result: SearchResult) => void }) => {
    const isPreviewable = isResultPreviewable(result)

    return (
        <div
            onClick={() => onClick(result)}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 cursor-pointer group active:scale-[0.99] transition-all"
        >
            <div className={cn(
                "shrink-0 transition-all",
                result.type === "user" ? "" : "mt-1 p-1.5 rounded-md bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
            )}>
                {getIcon(result)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-muted text-[9px] font-bold uppercase tracking-wider text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {result.type}
                    </span>
                </div>
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {getHighlightedTitle(result)}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                    {getContext(result)}
                </div>
            </div>
            {isPreviewable && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onPreview(result)
                    }}
                    className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                    title="Preview Attachment"
                >
                    <Eye className="h-4 w-4" />
                </button>
            )}
        </div>
    )
})
SearchResultItem.displayName = "SearchResultItem"

export default function DesktopNavigationSearch() {
    const searchRef = useRef<HTMLInputElement>(null)
    const {
        inputValue,
        setInputValue,
        results,
        isLoading,
        open,
        setOpen,
        handleClear,
        handleResultClick,
        handlePreview,
        handleSearchSubmit
    } = useSearch()

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

    const onClear = useCallback(() => {
        handleClear()
        searchRef.current?.focus()
    }, [handleClear])

    const handleKeyDownCapture = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearchSubmit()
        }
    }, [handleSearchSubmit])

    return (
        <div className="w-full max-w-[500px] font-sans">
            <Popover open={open && !!inputValue} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                        <Input
                            ref={searchRef}
                            type="search"
                            placeholder="Global Search... (Ctrl K)"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDownCapture}
                            onFocus={() => inputValue && setOpen(true)}
                            className={cn(
                                "h-10 w-full pl-9 pr-32 font-medium",
                                "text-sm placeholder:text-muted-foreground/60",
                                "rounded-xl border-border bg-muted/20",
                                "focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background",
                                "transition-all duration-200",
                                "[&::-webkit-search-cancel-button]:appearance-none"
                            )}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {inputValue && (
                                <button
                                    onClick={onClear}
                                    className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                            <kbd className="pointer-events-none hidden md:inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
                                <span className="text-xs">{typeof navigator !== "undefined" && navigator?.platform?.toLowerCase()?.includes("mac") ? "⌘" : "Ctrl"}</span> K
                            </kbd>
                        </div>
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[500px] p-0 shadow-2xl border-border bg-background/95 backdrop-blur-md rounded-xl overflow-hidden"
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="max-h-[450px] overflow-y-auto w-full scroll-smooth">
                        {inputValue && (
                            <div className="p-2">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                        <Loader2 className="h-6 w-6 animate-spin mb-2" />
                                        <p className="text-xs">Searching records...</p>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="space-y-1">
                                        {results.map((result, idx) => (
                                            <SearchResultItem
                                                key={idx}
                                                result={result}
                                                onClick={handleResultClick}
                                                onPreview={handlePreview}
                                            />
                                        ))}
                                        <div
                                            onClick={() => handleSearchSubmit()}
                                            className="p-3 text-center border-t border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                                        >
                                            <p className="text-xs font-semibold text-primary">View all results for "{inputValue}"</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
                                        <p className="text-sm font-medium text-foreground">No matches found</p>
                                        <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}