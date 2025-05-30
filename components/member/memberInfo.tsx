"use client"

import React from 'react';
import { Crown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {UserProfileDataInterface} from "@/types/user";
import {getNameInitials} from "@/lib/utils/getNameIntials";
import {useFetch} from "@/hooks/useFetch";
import {GetEndpointUrl} from "@/services/endPoints";
import {GetMediaURLRes} from "@/types/file";

interface MemberPropInfoInterface {
    userInfo: UserProfileDataInterface;
    isAdmin: boolean;
    handleMakeAdmin: (id: string) => void;
    handleRemoveAdmin: (id: string) => void;
    handleRemoveMember: (id: string) => void;
    isSelf: boolean;
}

const MemberInfo: React.FC<MemberPropInfoInterface> = ({
                                                           userInfo,
                                                           isAdmin,
                                                           isSelf,
                                                           handleRemoveAdmin,
                                                           handleMakeAdmin,
                                                           handleRemoveMember
                                                       }) => {
    const profileImageRes = useFetch<GetMediaURLRes>(userInfo.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL+'/'+userInfo.user_profile_object_key : '');
    const nameInitial = getNameInitials(userInfo.user_name);

    const handleCrownClick = () => {
        if ( !isAdmin || isSelf) return;
        if (userInfo.user_is_admin) {
            handleRemoveAdmin(userInfo.user_uuid);
        } else {
            handleMakeAdmin(userInfo.user_uuid);
        }
    };

    const handleLogOutClick = () => {
        if (!isSelf) {
            handleRemoveMember(userInfo.user_uuid);
        }
    };

    return (
        <div className='grid grid-cols-6 gap-4 items-center h-16 w-full'>
            <div className='flex items-center col-span-4 space-x-3'>
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
                        onClick={handleCrownClick}
                    />
                )}
            </div>

            <div className='flex justify-end'>
                {!isSelf && (
                    <LogOut
                        className='size-5 cursor-pointer'
                        onClick={handleLogOutClick}
                    />
                )}
            </div>
        </div>
    );
};

export default MemberInfo;

