"use client"
import {ArrowLeft, Clapperboard, LogOut, Plus} from "lucide-react"
import { Button } from "@/components/ui/button"
import {Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {
    ChannelInfoInterfaceResp,
    ChannelMemberUpdateInterface,
    ChannelNotificationInterface,
    NotificationType
} from "@/types/channel";
import {GroupedAvatar} from "@/components/groupedAvatar/groupedAvatar";
import {NotificationBell} from "@/components/Notification/notificationBell";
import React, {useEffect, useState} from "react";
import {getNextNotification} from "@/lib/utils/getNextNotification";
import {usePost} from "@/hooks/usePost";
import {useDispatch} from "react-redux";
import {openUI} from "@/store/slice/uiSlice";
import {UserProfileInterface} from "@/types/user";
import {useRouter} from "next/navigation";

interface SidePanelProps {
    channelId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ChannelMobileSheet({ open, onOpenChange, channelId }: SidePanelProps) {
    const [channelNotification, setChannelNotificationType] = useState<string>(NotificationType.NotificationAll)
    const postNotification  = usePost()
    const post  = usePost()
    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)
    const channelInfo = useFetch<ChannelInfoInterfaceResp>(`${channelId ? GetEndpointUrl.ChannelBasicInfo+'/'+channelId : ''}`);
    const isChannelCreator = (selfProfile.data?.data.user_uuid == channelInfo.data?.channel_info.ch_created_by.user_uuid)

    useEffect(() => {

        if(channelInfo.data?.channel_info.notification_type) {
            setChannelNotificationType(channelInfo.data?.channel_info.notification_type)
        }

    }, [channelInfo.data?.channel_info])

    const dispatch = useDispatch()

    const UpdateNotification = async () => {
        const nextNotification = getNextNotification(channelNotification)
        await postNotification.makeRequest<ChannelNotificationInterface>({payload:{channel_id: channelId, notification_type: nextNotification}, apiEndpoint: PostEndpointUrl.UpdateChannelNotification})
        setChannelNotificationType(nextNotification)
    }

    const handleRemoveMember = async () => {
        if(!selfProfile.data?.data.user_uuid || isChannelCreator ) return

        await post.makeRequest<ChannelMemberUpdateInterface>({apiEndpoint: PostEndpointUrl.RemoveChannelMember, payload:{channel_id: channelId, user_id: selfProfile.data?.data.user_uuid}})

    }


    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[80vw] flex flex-col h-full border-l border-border  p-0  backdrop-blur-sm">
                <SheetHeader className="border-b  p-4">
                    <div className="flex justify-between items-center gap-2">
                        <div className='flex items-center gap-x-2'>
                            <Button
                                variant="ghost"
                                size="icon"
                                className=""
                                onClick={() => onOpenChange(false)}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <SheetTitle className="text-xl font-normal overflow-ellipsis ">{channelInfo.data?.channel_info.ch_name}</SheetTitle>

                        </div>
                        <NotificationBell notificationType={channelNotification} isLoading={postNotification.isSubmitting} onNotCLick={UpdateNotification}/>



                    </div>
                </SheetHeader>
                <div className="flex flex-col flex-1 gap-6 p-6">
                    <section>


                                <h2 className="mb-2 text-lg">About</h2>
                                <p className="text-sm ">{channelInfo.data?.channel_info.ch_about || 'None'}</p>


                    </section>


                    <section>
                        <h3 className="mb-3 text-sm text-muted-foreground">{channelInfo.data?.channel_info.ch_member_count} member</h3>
                        <div className="flex items-center ">
                            <GroupedAvatar users={channelInfo.data?.channel_info.ch_members || []} max={3}/>
                            <div className="rounded-full border h-10 w-10 flex justify-center items-center border-dashed" onClick={()=>{dispatch(openUI({ key: 'editChannelMember', data: {channelUUID: channelId} }))}}>
                                <Plus className="h-4 w-4" />
                            </div>
                        </div>

                    </section>

                </div>
                <SheetFooter className='flex flex-row justify-between items-center p-2'>
                    {!isChannelCreator && <div className='flex gap-x-2 text-destructive' onClick={handleRemoveMember}>
                        <LogOut className='h6 w-6'/>
                        Exit from channel
                    </div>}

                </SheetFooter>

            </SheetContent>

        </Sheet>
    )
}

