"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Bell, MoreVertical, Pencil, Trash2} from "lucide-react";

interface MessageDesktopDropdownProps {
    setIsDropdownOpen: (open: boolean) => void;
}

export default function MessageDesktopDropdown({ setIsDropdownOpen }: MessageDesktopDropdownProps) {

    return (
        <DropdownMenu
            onOpenChange={(open) => {
                setIsDropdownOpen(open);
            }}
        >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ">
                    <MoreVertical className="h-4 w-4" stroke='#616060'/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>

                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <div className='flex items-center justify-center space-x-1.5'>
                            <div>
                                <Bell className='h-4 w-4'/>
                            </div>
                            <div>
                                Get reply notification
                            </div>
                        </div>

                        {/*<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <div className='flex items-center justify-center space-x-1.5'>
                            <div>
                                <Pencil className='h-4 w-4'/>
                            </div>
                            <div>
                                Edit message
                            </div>
                        </div>

                        {/*<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>

                    <div className='flex items-center justify-center space-x-1.5 text-destructive'>
                        <div>
                            <Trash2 className='h-4 w-4'/>
                        </div>
                        <div>
                            Delete message
                        </div>
                    </div>
                    {/*<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>*/}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}