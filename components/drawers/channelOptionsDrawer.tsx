"use client"

import * as React from "react"
import {CircleUser, Pencil, Users} from "lucide-react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {useDispatch} from "react-redux";
import {openUpdateChannelDialog, openUpdateChannelMemberDialog} from "@/store/slice/dialogSlice";
import {useFetch} from "@/hooks/useFetch";
import {ChannelInfoInterfaceResp} from "@/types/channel";
import {GetEndpointUrl} from "@/services/endPoints";


interface channelOptionsDrawerProps {
    drawerOpenState: boolean;
    channelId: string;
    setOpenState: (state: boolean) => void;
}

export function ChannelOptionsDrawer({drawerOpenState, setOpenState, channelId}: channelOptionsDrawerProps) {
    const channelInfo = useFetch<ChannelInfoInterfaceResp>(`${channelId ? GetEndpointUrl.ChannelBasicInfo+'/'+channelId : ''}`);

    const dispatch = useDispatch();
    function closeDrawer() {
        setOpenState(false);
    }

    return (
        <Drawer  onOpenChange={closeDrawer} open={drawerOpenState}>
            <DrawerContent>
                <div className=" w-full mb-6">
                    <DrawerHeader className='hidden'>
                        <DrawerTitle className='capitalize'>{process.env.NEXT_PUBLIC_ORG_NAME}</DrawerTitle>
                        <DrawerDescription>Org level</DrawerDescription>

                    </DrawerHeader>
                    <div className="p-4 pb-2">
                        <div className="flex flex-col items-center justify-start space-y-2">
                            {channelInfo.data?.channel_info.ch_is_admin && <div
                                className='w-full h-12 flex space-x-3 items-center'
                                onClick={()=>{dispatch(openUpdateChannelDialog({channelUUID:channelId}))}}
                            >
                                <Pencil />
                                <span>Edit channel</span>
                            </div>}
                            <div
                                className='w-full h-12 flex space-x-3 items-center'
                                onClick={() => dispatch(openUpdateChannelMemberDialog({channelUUID:channelId}))}
                            >
                                <Users/>
                                <span >Channel Members</span>
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
