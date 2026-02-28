"use client"

import * as React from "react"
import {CircleUser, ClipboardList, Shield, Users} from "lucide-react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {app_admin, app_channel_call, app_project_path, app_team_path} from "@/types/paths";
import {useRouter} from "next/navigation";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import type {UserProfileInterface} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";


interface orgDrawerDrawerProps {
    drawerOpenState: boolean;
    setOpenState: (state: boolean) => void;
}

export function OrgDrawer({drawerOpenState, setOpenState}:orgDrawerDrawerProps) {

    const router = useRouter()

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)


    function closeDrawer() {
        setOpenState(false);
    }

    const clickAdmin = () => {
        closeDrawer();
        router.push(app_admin);
    }

    const clickTeams = () => {
        closeDrawer();
        router.push(app_team_path);
    }


    const clickProjects = () => {
        closeDrawer();
        router.push(app_project_path);
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
                                onClick={clickTeams}
                            >
                                <Users className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-base font-medium">Teams</span>
                            </div>

                            <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={clickProjects}
                            >
                                <ClipboardList className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-base font-medium">Projects</span>
                            </div>


                            {
                                selfProfile.data?.data.user_is_admin &&
                                <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={clickAdmin}
                            >
                                <Shield className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-base font-medium">Admin control</span>
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
