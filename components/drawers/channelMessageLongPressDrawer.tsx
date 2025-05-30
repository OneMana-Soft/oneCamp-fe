"use client"

import * as React from "react"
import {Bell, Bookmark, CircleUser, Forward, Link, MessageSquareText, Pencil, Trash2, Type, Users} from "lucide-react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useDispatch } from "react-redux"
import {
    openUpdateChannelDialog,
    openUpdateChannelMemberDialog,
    openUpdateUserStatusDialog
} from "@/store/slice/dialogSlice"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import addEmojiIconSrc from "@/assets/addEmoji.svg"
import { Card, CardContent } from "@/components/ui/card"
import {Separator} from "@/components/ui/separator";
import {preSelectedEmojis} from "@/components/drawers/consts/preSelectedEmojiConst";
import {DrawerActionCard} from "@/components/drawerActionCard/drawerActionCard";
import {DrawerActionLink} from "@/components/drawerActionLink/drawerActionLink";
import {DrawerDestructiveActionLink} from "@/components/drawerActionLink/drawerDestructiveActionLink";

interface channelOptionsDrawerProps {
    drawerOpenState: boolean
    setOpenState: (state: boolean) => void
    onAddEmoji: () => void
}



export function ChannelMessageLongPressDrawer({ drawerOpenState, setOpenState, onAddEmoji }: channelOptionsDrawerProps) {
    const dispatch = useDispatch()

    function closeDrawer() {
        setOpenState(false)
    }

    // Handlers for card clicks
    const handleReplyClick = () => {
        console.log("Reply clicked")
        // Add your reply logic here
    }

    const handleForwardClick = () => {
        console.log("Forward clicked")
        // Add your forward logic here
    }

    const handleSaveClick = () => {
        console.log("Save clicked")
        // Add your save logic here
    }

    return (
        <Drawer onOpenChange={closeDrawer} open={drawerOpenState}>
            <DrawerContent>
                <div className="w-full mb-6 relative">
                    <DrawerHeader className="hidden">
                        <DrawerTitle></DrawerTitle>
                        <DrawerDescription></DrawerDescription>
                    </DrawerHeader>

                    <div className="flex-col p-4 pb-2 space-y-4">
                        {/* Emoji Buttons */}
                        <div className="flex justify-between">

                            {
                                preSelectedEmojis.map(( e) => {
                                    return (

                                        <Button variant="secondary" size="icon" className="rounded-full" key={e.emojiId}>
                                            {e.emojiString}
                                        </Button>
                                    )
                                })
                            }


                            <Button variant="secondary" size="icon" className="rounded-full">
                                <Image
                                    src={addEmojiIconSrc || "/placeholder.svg?height=24&width=24"}
                                    alt="Add Emoji"
                                    width={18}
                                    height={18}
                                    className="hover:cursor-pointer"
                                    onClick={() => {
                                        onAddEmoji()
                                    }}
                                />
                            </Button>
                        </div>

                        {/* Cards Section */}
                        <div className="flex flex-wrap gap-2">

                            <DrawerActionCard
                                onCardClick={handleReplyClick}
                                Icon={MessageSquareText}
                                cardText={'Reply'}
                            />

                            <DrawerActionCard
                                onCardClick={handleForwardClick}
                                Icon={Forward}
                                cardText={'Forward'}
                            />

                            <DrawerActionCard
                                onCardClick={handleSaveClick}
                                Icon={Bookmark}
                                cardText={'Save'}
                            />

                        </div>

                        <div className="flex flex-col items-center justify-start  pt-2">

                            <DrawerActionLink
                                onLinkClick={()=>{}}
                                linkText={'Get reply notification'}
                                Icon={Bell}
                             />

                            <DrawerActionLink
                                onLinkClick={()=>{}}
                                linkText={'Copy link to message'}
                                Icon={Link}
                            />

                            <DrawerActionLink
                                onLinkClick={()=>{}}
                                linkText={'Copy all text'}
                                Icon={Type}
                            />


                            <DrawerActionLink
                                onLinkClick={()=>{}}
                                linkText={'Edit message'}
                                Icon={Pencil}
                            />

                        </div>

                        <Separator orientation="horizontal" className='absolute w-full left-0'/>

                        <div className="flex flex-col items-center justify-start  pt-2">

                            <DrawerDestructiveActionLink
                                onLinkClick={()=>{}}
                                linkText={'Delete message'}
                                Icon={Trash2}
                            />

                        </div>


                    </div>


                </div>
            </DrawerContent>
        </Drawer>
    )
}