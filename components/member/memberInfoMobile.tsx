"use client"

import React from 'react';
import { Crown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {UserProfileDataInterface} from "@/types/user";
import {getNameInitials} from "@/lib/utils/format/getNameIntials";
import {useFetch, useMediaFetch} from "@/hooks/useFetch";
import {GetEndpointUrl} from "@/services/endPoints";
import {GetMediaURLRes} from "@/types/file";
import {useLongPress} from "@/hooks/useLongPress";

interface MemberPropInfoInterface {
    userInfo: UserProfileDataInterface;
    isAdmin: boolean;
    longPressAction: () => void
    isSelf: boolean;
}

const MemberInfoMobile: React.FC<MemberPropInfoInterface> = ({
                                                           userInfo,
                                                           isAdmin,
                                                           isSelf,
                                                           longPressAction
                                                       }) => {
    const profileImageRes = useMediaFetch<GetMediaURLRes>(userInfo.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL+'/'+userInfo.user_profile_object_key : '');
    const nameInitial = getNameInitials(userInfo.user_name);

    const longPressEvent = useLongPress(longPressAction, {
        threshold: 500, // Reduced from 800ms to 500ms for quicker long press
        onLongPressStart: () =>{

        }
    })

    return (
        <div className='grid grid-cols-4 items-center h-16 w-full px-2 py-2 ' {...longPressEvent}>
            <div className='flex items-center col-span-3 space-x-3'>
                <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage
                        src={profileImageRes.data?.url || ""}
                        alt="Profile icon"
                    />
                    <AvatarFallback>{nameInitial}</AvatarFallback>
                </Avatar>
                <div className='min-w-0 overflow-ellipsis truncate whitespace-nowrap'>
                    <div className='truncate font-medium'>{userInfo.user_name}</div>
                    <div className='truncate text-sm text-muted-foreground'>{userInfo.user_email_id}</div>
                </div>
            </div>

            <div className='flex justify-center'>
                {(userInfo.user_is_admin || isAdmin) && (
                    <Crown
                        className={`size-5 ${(!isSelf &&isAdmin )? "cursor-pointer" : ""}`}
                        fill={userInfo.user_is_admin ? '#facc15' : 'none'}
                    />
                )}
            </div>

        </div>
    );
};

export default MemberInfoMobile;

