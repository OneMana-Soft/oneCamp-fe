"use client"

import * as React from "react"
import {CircleUser, Pencil, Plus, Shield, Users} from "lucide-react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {app_admin, app_channel_call, app_team_path} from "@/types/paths";
import {useRouter} from "next/navigation";
import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import type {UserProfileInterface} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";
import {openUI} from "@/store/slice/uiSlice";
import {useDispatch} from "react-redux";
import {TeamInfoRawInterface} from "@/types/team";


interface orgDrawerDrawerProps {
    drawerOpenState: boolean;
    setOpenState: (state: boolean) => void;
    teamName: string;
    teamId: string;
}

export function TeamOptionsDrawer({drawerOpenState, setOpenState, teamId, teamName}:orgDrawerDrawerProps) {

    const dispatch = useDispatch();
    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)
    const teamInfo = useFetch<TeamInfoRawInterface>(teamId ? GetEndpointUrl.GetTeamInfo + '/' + teamId :'')


    function closeDrawer() {
        setOpenState(false);
    }

    const clickEditTeamMember = () => {
        closeDrawer();
        dispatch(openUI({
            key: 'teamMembers',
            data: { teamUUID: teamId, teamName: teamName}
        }))
    }

    const editTeamName = () => {
        closeDrawer();
        dispatch(openUI({ key: 'editTeamName', data: { teamUUID: teamId || '' } }))
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
                            <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={clickEditTeamMember}
                            >
                                <Users className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-base font-medium">Team members</span>
                            </div>

                            {
                                (selfProfile.data?.data.user_is_admin || teamInfo.data?.data.team_is_admin) &&
                                <div
                                    className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                    onClick={editTeamName}
                                >
                                    <Pencil className="h-5 w-5 text-muted-foreground"/>
                                    <span className="text-base font-medium">Edit team name</span>
                                </div>
                            }

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
