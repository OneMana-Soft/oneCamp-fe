"use client"

import * as React from "react"
import {CircleUser, Clapperboard, Pencil, Users, Video} from "lucide-react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {useDispatch} from "react-redux";
import {openUI} from "@/store/slice/uiSlice";
import {useFetch} from "@/hooks/useFetch";
import {ChannelInfoInterfaceResp} from "@/types/channel";
import {GetEndpointUrl} from "@/services/endPoints";
import {app_channel_call} from "@/types/paths";
import {useRouter} from "next/navigation";


interface channelOptionsDrawerProps {
    drawerOpenState: boolean;
    channelId: string;
    setOpenState: (state: boolean) => void;
}

export function ChannelOptionsDrawer({drawerOpenState, setOpenState, channelId}: channelOptionsDrawerProps) {
    const channelInfo = useFetch<ChannelInfoInterfaceResp>(`${channelId ? GetEndpointUrl.ChannelBasicInfo+'/'+channelId : ''}`);

    const dispatch = useDispatch();
    const router = useRouter();
    function closeDrawer() {
        setOpenState(false);
    }

    const clickVideoCall = () => {
        closeDrawer();
        router.push(app_channel_call + "/" + channelId);

    }

    return (
    <Drawer  onOpenChange={closeDrawer} open={drawerOpenState}>
            <DrawerContent>
                <div className=" w-full mb-6">
                    <DrawerHeader className='hidden'>
                        <DrawerTitle className='capitalize'>{process.env.NEXT_PUBLIC_ORG_NAME}</DrawerTitle>
                        <DrawerDescription>Org level</DrawerDescription>

                    </DrawerHeader>
                    <div className="p-4 pb-6">
                        <div className="flex flex-col items-center justify-start space-y-1">
                            {channelInfo.data?.channel_info.ch_is_admin && <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={()=>{dispatch(openUI({ key: 'editChannel', data: {channelUUID:channelId} }))}}
                            >
                                <Pencil className="h-5 w-5 text-muted-foreground" />
                                <span className="text-base font-medium">Edit channel</span>
                            </div>}
                            <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={() => dispatch(openUI({ key: 'editChannelMember', data: {channelUUID:channelId} }))}
                            >
                                <Users className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-base font-medium">Channel Members</span>
                            </div>

                            <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={clickVideoCall}
                            >
                                <Video className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-base font-medium">Join Call</span>
                            </div>
                            <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={() => {
                                    closeDrawer();
                                    router.push(`/app/channel/${channelId}/recording`);
                                }}
                            >
                                <Clapperboard className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-base font-medium">Call Recordings</span>
                            </div>
                        </div>

                    </div>
                    {/*<DrawerFooter>*/}
                    {/*    <Button>Submit</Button>*/}
                    {/*    <DrawerClose asChild>*/}
                    {/*        <Button variant="outline">Cancel</Button>*/}
                    {/*    </DrawerClose>*/}
                    {/*</DrawerFooter>*/}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
