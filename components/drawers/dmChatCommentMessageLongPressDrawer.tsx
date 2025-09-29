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
import {app_home_path, app_message_forward_path} from "@/types/paths";
import {useRouter} from "next/navigation";

interface dmChatCommentOptionsDrawerProps {
    drawerOpenState: boolean
    setOpenState: (state: boolean) => void
    onAddEmoji: () => void
    editMessage: () => void
    deleteMessage: () => void
    copyTextToClipboard: () => void
    handleEmojiClick: (emojiId: string) => void
    isOwner?: boolean
    isAdmin?: boolean
}



export function DmChatCommentMessageLongPressDrawer({ drawerOpenState, deleteMessage, setOpenState, onAddEmoji, copyTextToClipboard, editMessage, handleEmojiClick, isAdmin, isOwner }: dmChatCommentOptionsDrawerProps) {


    function closeDrawer() {
        setOpenState(false)
    }

    const handleEditClick = () => {
        editMessage()
        closeDrawer()
    }


    const handleDeleteClick = () => {
        setTimeout(() => {
            deleteMessage()
        }, 100);

        closeDrawer()
    }

    const emojiClick = (emojiId: string) => {
        handleEmojiClick(emojiId)
        closeDrawer()
    }

    const handleCopyClick = () => {
        copyTextToClipboard()
        closeDrawer()
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

                                        <Button variant="secondary" size="icon" className="rounded-full" key={e.emojiId} onClick={()=>{emojiClick(e.emojiId)}}>
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

                        <div className="flex flex-col items-center justify-start  pt-2">

                            <DrawerActionLink
                                onLinkClick={handleCopyClick}
                                linkText={'Copy all text'}
                                Icon={Type}
                            />


                            <DrawerActionLink
                                onLinkClick={handleEditClick}
                                linkText={'Edit message'}
                                Icon={Pencil}
                            />

                        </div>

                        {(isAdmin || isOwner)  && <><Separator orientation="horizontal" className='absolute w-full left-0'/>

                            <div className="flex flex-col items-center justify-start  pt-2">

                                <DrawerDestructiveActionLink
                                    onLinkClick={handleDeleteClick}
                                    linkText={'Delete message'}
                                    Icon={Trash2}
                                />

                            </div></>}


                    </div>


                </div>
            </DrawerContent>
        </Drawer>
    )
}