"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Hash, Loader2 } from "lucide-react"
import { debounceUtil } from "@/lib/utils/debounce"
import { cn } from "@/lib/utils/cn"
import { ChannelAndUserListInterfaceReq, ChannelAndUserListInterfaceResp } from "@/types/user"
import { usePost } from "@/hooks/usePost"
import { PostEndpointUrl } from "@/services/endPoints"
import { FwdMsgToProfileAvatar } from "@/components/searchDropdown/fwdMsgToDropdown/fwdMsgToProfileAvatar"

interface SearchDropdownProps {
    onSelect?: (user: ChannelAndUserListInterfaceResp) => void
    placeholder?: string
}

export function FwdMsgToDropdown({ onSelect, placeholder = "Search..." }: SearchDropdownProps) {
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [results, setResults] = useState<ChannelAndUserListInterfaceResp[]>([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const { makeRequest, isSubmitting } = usePost()

    const debounceSearchQuery = useCallback(() => {
        console.log("making reqasdasd ")
        makeRequest<ChannelAndUserListInterfaceReq, ChannelAndUserListInterfaceResp[]>({
            apiEndpoint: PostEndpointUrl.SearchUserAndChannel,
            payload: { search_text: query },
        }).then((resp) => {
            setResults(resp || [])
        })
    }, [query, makeRequest])

    const debouncedSearch = useMemo(() => debounceUtil(debounceSearchQuery, 300), [debounceSearchQuery])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value)

        if (value.trim()) {
            console.log("making reqasdassasaa666666d ")
            setIsOpen(true)
            debouncedSearch()
        } else {
            setIsOpen(false)
            setResults([])
        }
    }

    const handleSelect = (user: ChannelAndUserListInterfaceResp) => {
        if (onSelect) {
            onSelect(user)
        }
        setQuery("")
        setIsOpen(false)
        setResults([])
        inputRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
                break
            case "ArrowUp":
                e.preventDefault()
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
                break
            case "Enter":
                e.preventDefault()
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    handleSelect(results[selectedIndex])
                }
                break
            case "Escape":
                e.preventDefault()
                setIsOpen(false)
                break
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.trim() && setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full "
                />
                {isSubmitting && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                )}
            </div>

            {isOpen && (results.length > 0 || isSubmitting) && (
                <div
                    ref={dropdownRef}
                    className="absolute z-10 mt-1 w-full rounded-md bg-background border  shadow-lg"
                >
                    <ul className="max-h-60 overflow-auto py-1">
                        {results.length && results.map((channelOrUserInfo, index) => (
                            <li
                                key={channelOrUserInfo.channel_uuid || channelOrUserInfo.user_uuid}
                                onClick={() => handleSelect(channelOrUserInfo)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={cn(
                                    "px-3 py-2 flex items-center cursor-pointer space-x-2 data-highlighted",
                                    "hover:bg-gray-200"
                                )}
                            >
                                {channelOrUserInfo.user_uuid ? (
                                    <FwdMsgToProfileAvatar
                                        userProfileObjKey={channelOrUserInfo.user_profile_object_key}
                                        userName={channelOrUserInfo.user_name}
                                    />
                                ) : (
                                    <Hash className="text-muted-foreground" />
                                )}
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <span className="font-medium ">
                                            {channelOrUserInfo.user_name || channelOrUserInfo.channel_name}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}