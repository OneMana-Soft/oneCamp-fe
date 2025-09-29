"use client"

import {usePathname} from "next/navigation";
import {Star} from "lucide-react";
import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {getStaticPaths} from "next/dist/build/templates/pages";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {ChannelInfoInterfaceResp} from "@/types/channel";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {usePost} from "@/hooks/usePost";
import {USER_STATUS_ONLINE, UserProfileInterface} from "@/types/user";
import {ChatUserAvatar} from "@/components/chat/chatUserAvatar";
import {updateUserConnectedDeviceCount, updateUserEmojiStatus, updateUserStatus} from "@/store/slice/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {ChatUserEmojiStatus} from "@/components/chat/chatUserEmojiStatus";

export function MobileTopNavigationBarSecondChat({chatUUID}:{chatUUID: string}) {

    const otherUserInfo  = useFetchOnlyOnce<UserProfileInterface>(`${GetEndpointUrl.SelfProfile}/${chatUUID}`)

    const dispatch = useDispatch();

    const userStatusState = useSelector((state: RootState) => state.users.usersStatus[chatUUID] || []);

    useEffect(() => {


        if(otherUserInfo.data?.data.user_emoji_statuses && otherUserInfo.data?.data.user_emoji_statuses.length > 0) {
            dispatch(updateUserEmojiStatus({userUUID: otherUserInfo.data?.data.user_uuid, status:otherUserInfo.data.data.user_emoji_statuses[0]}));
        }

        if(otherUserInfo.data?.data.user_status) {
            dispatch(updateUserStatus({userUUID: otherUserInfo.data?.data.user_uuid, status:otherUserInfo.data.data.user_status}));
        }

        if(otherUserInfo.data?.data.user_device_connected) {
            dispatch(updateUserConnectedDeviceCount({userUUID: otherUserInfo.data?.data.user_uuid, deviceConnected:otherUserInfo.data.data.user_device_connected}));
        }
    }, [otherUserInfo.data?.data])


    if(!otherUserInfo.data && !otherUserInfo.isLoading) return

    const isOnline = userStatusState.status == USER_STATUS_ONLINE && userStatusState.deviceConnected && userStatusState.deviceConnected > 0

    return (
        <div className='flex justify-center  px-2'>

            <div className='font-bold flex justify-center items-center space-x-3 text-lg text-center truncate overflow-auto overflow-ellipsis'>
                    <div className='relative'>
                        <ChatUserAvatar userName={otherUserInfo.data?.data.user_name}
                                        userProfileObjKey={otherUserInfo.data?.data.user_profile_object_key}/>
                        {isOnline && <div className={`h-2.5 w-2.5 ring-[2px] ring-background rounded-full bg-green-500 absolute bottom-0 right-0`}></div>}

                    </div>
                    <div>{otherUserInfo.data?.data.user_name}</div>
                    <ChatUserEmojiStatus userUUID={chatUUID}/>
            </div>

        </div>

    );
}