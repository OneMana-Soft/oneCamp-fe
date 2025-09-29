import {USER_STATUS_ONLINE, UserProfileDataInterface} from "@/types/user";
import {ChatUserAvatar} from "@/components/chat/chatUserAvatar";
import React, {useEffect} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/getNameIntials";
import {updateUserConnectedDeviceCount, updateUserEmojiStatus, updateUserStatus} from "@/store/slice/userSlice";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store/store";

export const DesktopNavigationChatAvatar = ({userInfo}: {userInfo: UserProfileDataInterface}) => {

    const profileImageRes = useMediaFetch<GetMediaURLRes>(userInfo.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL+'/'+userInfo.user_profile_object_key : '');

    const nameInitial = getNameInitials(userInfo.user_name);

    const userStatusState = useSelector((state: RootState) => state.users.usersStatus[userInfo.user_uuid] || []);


    const dispatch = useDispatch()

    useEffect(() => {

        if(userInfo.user_emoji_statuses && userInfo.user_emoji_statuses.length > 0) {
            dispatch(updateUserEmojiStatus({userUUID: userInfo.user_uuid, status:userInfo.user_emoji_statuses[0]}));
        }

        if(userInfo.user_status) {
            dispatch(updateUserStatus({userUUID: userInfo.user_uuid, status:userInfo.user_status}));
        }

        if(userInfo.user_device_connected) {
            dispatch(updateUserConnectedDeviceCount({userUUID: userInfo.user_uuid, deviceConnected:userInfo.user_device_connected}));
        }

    }, [userInfo]);

    const isOnline = userStatusState.status == USER_STATUS_ONLINE && userStatusState.deviceConnected && userStatusState.deviceConnected > 0

    return (
        <div className='relative'>
            <Avatar className='h-5 w-5 hover:cursor-pointer' >
                <AvatarImage src={profileImageRes.data?.url}/>
                <AvatarFallback  className="bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 text-white md:text-sm">{nameInitial[0]}</AvatarFallback>
            </Avatar>
            {isOnline && <div className={`h-2 w-2 ring-[1px] ring-background rounded-full bg-green-500 absolute bottom-0 right-0`}></div>}

        </div>
    )
}