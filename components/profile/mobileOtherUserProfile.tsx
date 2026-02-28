"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { openUI } from "@/store/slice/uiSlice";
import { useFetch, useMediaFetch } from "@/hooks/useFetch";
import { GetEndpointUrl } from "@/services/endPoints";
import { UserProfileInterface } from "@/types/user";
import { GetMediaURLRes } from "@/types/file";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageSquare } from "lucide-react";
import {useUserInfoState} from "@/hooks/useUserInfoState";
import {USER_STATUS_ONLINE} from "@/types/user";
import { Button } from "@/components/ui/button";
import {AttachmentMediaReq} from "@/types/attachment";

export function MobileOtherUserProfile({ userUUID }: { userUUID: string }) {
    const router = useRouter();
    const dispatch = useDispatch();

    const profileInfo = useFetch<UserProfileInterface>(userUUID ? GetEndpointUrl.SelfProfile + '/' + userUUID : '');
    const profileImageRes = useMediaFetch<GetMediaURLRes>(profileInfo?.data?.data?.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL + '/' + profileInfo.data.data.user_profile_object_key : '');

    const nameIntialsArray = profileInfo.data?.data?.user_name?.split(" ") || ["Unknown"];
    let nameIntial = nameIntialsArray[0][0]?.toUpperCase() || "U";
    if (nameIntialsArray?.length > 1) {
        nameIntial += nameIntialsArray[1][0]?.toUpperCase() || "";
    }

    const userStatusState = useUserInfoState(userUUID)
    
    const isReduxLoaded = userStatusState && userStatusState.deviceConnected !== -1;
    const currentStatus = isReduxLoaded && userStatusState.status ? userStatusState.status : (profileInfo.data?.data?.user_status || 'offline');
    const currentDeviceCount = isReduxLoaded ? userStatusState.deviceConnected : (profileInfo.data?.data?.user_device_connected || 0);

    const isOnline = currentStatus === USER_STATUS_ONLINE && currentDeviceCount > 0;

    return (
        <div className="flex flex-col h-full bg-background w-full">

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto w-full">
                <div className="p-4 md:p-6 lg:p-8 space-y-8 pb-20">
                    
                    {/* Avatar Section */}
                    <div className="flex flex-col justify-center items-center mt-4">
                        <div 
                            className={`relative ${profileInfo.data?.data?.user_profile_object_key ? 'cursor-pointer active:opacity-80 transition-opacity' : ''}`}
                            onClick={() => {
                                if (profileInfo.data?.data?.user_profile_object_key) {
                                    const media: AttachmentMediaReq = {
                                        attachment_uuid: profileInfo.data.data.user_profile_object_key,
                                        attachment_file_name: profileInfo.data.data.user_name + " Profile Image",
                                        attachment_type: "image",
                                        attachment_size: 0,
                                        attachment_created_at: new Date().toISOString(),
                                    } as AttachmentMediaReq;
                                    dispatch(openUI({
                                        key: 'attachmentLightbox',
                                        data: {
                                            media: media,
                                            allMedia: [media],
                                            mediaGetUrl: GetEndpointUrl.PublicAttachmentURL
                                        }
                                    }));
                                }
                            }}
                        >
                            <Avatar className="h-40 w-40 border-4 border-muted shadow-sm mb-4">
                                <AvatarImage src={profileImageRes.data?.url} alt={`${profileInfo.data?.data?.user_name}'s profile`} />
                                <AvatarFallback className="text-4xl text-muted-foreground">{nameIntial}</AvatarFallback>
                            </Avatar>
                            {isOnline && <div className={`h-8 w-8 ring-[4px] ring-background rounded-full bg-green-500 absolute bottom-5 right-2`}></div>}
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground text-center">
                            {profileInfo.data?.data?.user_name || "Loading..."}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1 text-center">
                            {profileInfo.data?.data?.user_email_id || "\u00A0"}
                        </p>
                        <Button 
                            variant="secondary" 
                            className="mt-6 w-full max-w-[200px] gap-2 font-medium"
                            onClick={() => router.push(`/app/chat/${userUUID}`)}
                        >
                            <MessageSquare className="h-4 w-4" />
                            Message
                        </Button>
                    </div>

                    {/* Details Section */}
                    <div className="bg-muted/10 p-5 rounded-2xl border space-y-5 shadow-sm">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</p>
                            <p className="text-base font-medium text-foreground">{profileInfo.data?.data?.user_full_name || "—"}</p>
                        </div>
                        
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Display Name</p>
                            <p className="text-base font-medium text-foreground">{profileInfo.data?.data?.user_name || "—"}</p>
                        </div>
                        
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Title</p>
                            <p className="text-base font-medium text-foreground">{profileInfo.data?.data?.user_job_title || "—"}</p>
                        </div>
                        
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hobbies</p>
                            <p className="text-base font-medium text-foreground">{profileInfo.data?.data?.user_hobbies || "—"}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
