"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils/helpers/cn"
import { X, Search, Eye } from "lucide-react"
import { useRef, useCallback } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSearch } from "@/hooks/useSearch"
import { getIcon, getHighlightedTitle, getContext, isResultPreviewable } from "@/lib/utils/helpers/search"

export function MobileHomeSearchBar() {
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
        <div className='relative w-full flex justify-center items-center'>
            <Drawer open={open && !!inputValue} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <div className="relative w-full">
                        <Input
                            ref={searchRef}
                            type="search"
                            placeholder="Search..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDownCapture}
                            onFocus={() => inputValue && setOpen(true)}
                            className={cn(
                                "h-10 w-full pl-4 pr-10",
                                " placeholder:text-zinc-500",
                                "rounded-full shadow-sm bg-secondary",
                                "focus-visible:ring-1 focus-visible:ring-zinc-500",
                                "transition-colors",
                                "[&::-webkit-search-cancel-button]:appearance-none"
                            )}
                        />
                        {inputValue && (
                            <div
                                onClick={onClear}
                                className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 text-zinc-500 hover:cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                </DrawerTrigger>
                <DrawerContent className="h-[80vh] z-50">
                    <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mt-2 mb-4" />
                    <DrawerHeader className="text-left px-4 pb-2">
                        <DrawerTitle className="text-xl font-bold">Search results for "{inputValue}"</DrawerTitle>
                    </DrawerHeader>
                    <ScrollArea className="flex-1 px-4 pb-6">
                        {inputValue && (
                            <div className="mt-4">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                        <Search className="h-8 w-8 animate-pulse mb-2" />
                                        <p className="text-sm">Searching...</p>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="space-y-3">
                                        {results.map((result, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleResultClick(result)}
                                                className="flex items-center gap-4 p-3 rounded-xl border border-border bg-card shadow-sm active:scale-[0.98] transition-all relative"
                                            >
                                                <div className={cn(
                                                    "shrink-0",
                                                    result.type === "user" ? "" : "mt-1 p-2 rounded-lg bg-muted text-muted-foreground"
                                                )}>
                                                    {getIcon(result)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                            {result.type}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm font-semibold text-foreground line-clamp-2">
                                                        {getHighlightedTitle(result)}
                                                    </div>
                                                    <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                                                        {getContext(result)}
                                                    </div>
                                                </div>
                                                {isResultPreviewable(result) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handlePreview(result)
                                                        }}
                                                        className="p-2 rounded-full bg-primary/5 text-primary active:bg-primary/20 transition-all ml-1"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        <p className="text-sm font-medium">No results found</p>
                                        <p className="text-xs mt-1">Try a different keyword</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        </div>
    )
}