"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserEmojiStatus, UserProfileInterface} from "@/types/user";
import {error_not_authorised_path} from "@/types/paths";
import {GetEndpointUrl} from "@/services/endPoints";
import {useDispatch} from "react-redux";
import {updateUserConnectedDeviceCount, updateUserEmojiStatus, updateUserStatus} from "@/store/slice/userSlice";
import { UserProfileResponseSchema } from "@/lib/validations/schemas";

export function AppProtectedRoute({ children }: { children: React.ReactNode }) {

    const userProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile, UserProfileResponseSchema as any);
    const router = useRouter();
    const dispatch = useDispatch();



    useEffect(() => {
        if (userProfile.isError) {
            router.push(error_not_authorised_path);
        } else if (!userProfile.isLoading && !userProfile.data?.data) {
            router.push(error_not_authorised_path);
        }


        if(userProfile.data?.data) {
            dispatch(updateUserEmojiStatus({userUUID: userProfile.data?.data.user_uuid, status:userProfile.data?.data.user_emoji_statuses?.[0] || {} as UserEmojiStatus}));
            dispatch(updateUserStatus({userUUID: userProfile.data?.data.user_uuid, status:userProfile.data.data.user_status || 'online'}));
            dispatch(updateUserConnectedDeviceCount({userUUID: userProfile.data?.data.user_uuid, deviceConnected:userProfile.data?.data.user_device_connected || 0}));

        }

    }, [userProfile.isError, userProfile.isLoading, userProfile.data?.data, router]);

    if (userProfile.isLoading) {
        return (
            <div className='flex justify-center items-center h-[100vh] space-x-3'>
                <Loader2 className="size-10 animate-spin" />
            </div>
        );
    }

    if (!userProfile.isLoading && userProfile.data?.data) {
        return children;
    }

    return null;


    // return children


}