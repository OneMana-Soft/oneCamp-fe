"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils/helpers/cn"
import {UserProfileDataInterface} from "@/types/user";
import {DesktopNavigationChatAvatar} from "@/components/navigationBar/desktop/desktopNavigationChatAvatar";


type AssigneePickerProps = {
    isAdmin: boolean
    label: string
    members: UserProfileDataInterface[]
    assignee?: UserProfileDataInterface
    onChange: (userInfo: UserProfileDataInterface | undefined) => void
}

export function TaskAssigneePicker({ isAdmin, label, members, assignee, onChange }: AssigneePickerProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="grid items-center grid-cols-6 mb-2">
            <div className="col-span-1">
                <span className="text-xs capitalize">{label}</span>
            </div>
            <div className="col-span-5 md:-ml-4 ">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[220px] justify-between font-normal h-10 bg-transparent group hover:bg-muted/40 transition-all duration-300 rounded-xl px-4"
                            disabled={!isAdmin}
                        >
                            <div className='flex text-sm font-medium gap-x-2 items-center truncate'>
                                {assignee && <DesktopNavigationChatAvatar userInfo={assignee}/>}
                                <span className="truncate">{assignee ? assignee.user_name : "Select assignee"}</span>
                            </div>
                            <ChevronsUpDown className="invisible group-hover:visible ml-2 h-4 w-4 shrink-0 opacity-40" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0 shadow-xl border-border/50 rounded-xl overflow-hidden">
                        <Command className="bg-popover">
                            <CommandInput placeholder="Search member..." className="h-9 border-none focus:ring-0 shadow-none"/>
                            <CommandList className="max-h-[200px] overflow-y-auto">
                                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">No member found.</CommandEmpty>
                                <CommandGroup>
                                    {members.map((member) => (
                                        <CommandItem
                                            key={member.user_uuid}
                                            value={member.user_uuid}
                                            onSelect={(currentValue) => {
                                                const t = members.find((m) => m.user_uuid === currentValue)
                                                const selected = currentValue === assignee?.user_uuid ? undefined : t
                                                onChange(selected)
                                                setOpen(false)
                                            }}
                                            className="cursor-pointer p-2 rounded-lg m-1 gap-3 aria-selected:bg-primary/5 transition-colors duration-200"
                                        >
                                            <span className="flex-1 font-semibold text-sm">{member.user_name}</span>
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4 text-primary",
                                                    assignee?.user_uuid === member.user_uuid ? "opacity-100" : "opacity-0",
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
