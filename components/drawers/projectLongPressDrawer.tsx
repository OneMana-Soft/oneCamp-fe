"use client"

import * as React from "react"
import {CircleUser, RotateCcw, Shield, Trash, Users} from "lucide-react"

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
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {useDebounce} from "@/hooks/useDebounce";
import {useState} from "react";
import {ProjectAddOrRemoveInterface} from "@/types/project";
import {usePost} from "@/hooks/usePost";
import {openUI} from "@/store/slice/uiSlice";
import {useDispatch} from "react-redux";
import {TeamInfoRawInterface} from "@/types/team";


interface orgDrawerDrawerProps {
    drawerOpenState: boolean;
    setOpenState: (state: boolean) => void;
    isAdmin: boolean;
    isMember: boolean;
    isDeleted: boolean;
    projectId: string;
    teamId: string;
}

export function ProjectLongPressDrawer({drawerOpenState, setOpenState, isMember, isAdmin, isDeleted, projectId, teamId}:orgDrawerDrawerProps) {

    const teamProjectList = useFetch<TeamInfoRawInterface>(teamId ? GetEndpointUrl.GetTeamProjectList + '/' + teamId :'')

    const dispatch = useDispatch()

    const post = usePost()

    const execDelete = () => {
        post.makeRequest<ProjectAddOrRemoveInterface>({
            apiEndpoint: PostEndpointUrl.DeleteProject,
            payload: {
                project_uuid: projectId
            }
        }).then(()=>{
            teamProjectList.mutate()
        })
    }

    const handleDelete = () => {

        setTimeout(() => {
            dispatch(openUI({
                key: 'confirmAlert',
                data: {
                    title: "Archiving project",
                    description: "Are you sure you want to proceed archiving the project",
                    confirmText: "Archive project",
                    onConfirm: ()=>{execDelete()}
                }
            }));
        }, 500);


    }

    const execUndelete = () => {
        post.makeRequest<ProjectAddOrRemoveInterface>({
            apiEndpoint: PostEndpointUrl.UndeleteProject,
            payload: {
                project_uuid: projectId
            }
        }).then(()=>{
            teamProjectList.mutate()
        })
    }

    const handleUnDelete = async () => {
        if(!projectId) return

        setTimeout(() => {
            dispatch(openUI({
                key: 'confirmAlert',
                data: {
                    title: "UnArchiving project",
                    description: "Are you sure you want to proceed unarchiving the project",
                    confirmText: "UnArchive project",
                    onConfirm: ()=>{execUndelete()}
                }
            }));
        }, 500);


    }

    const handleProjectMembers = () => {
        closeDrawer();
        dispatch(openUI({ key: 'editProjectMember', data: {projectUUID: projectId} }))
    }

    function closeDrawer() {
        setOpenState(false);
    }

    const clickAdmin = () => {
        if(isDeleted) {
            handleUnDelete()
        }else {
            handleDelete()
        }
    }

    if(!projectId) return

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
                            {
                                (isAdmin || isMember) && <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={handleProjectMembers}
                            >
                                <Users className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-base font-medium">Project members</span>
                            </div>
                            }

                            {
                                isAdmin &&
                                <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={clickAdmin}
                            >
                                    { isDeleted ?

                                        <>
                                            <RotateCcw className="h-5 w-5 text-muted-foreground"/>
                                            <span className="text-base font-medium">Unarchive project</span>
                                        </>
                                        :
                                        <>
                                            <Trash className="h-5 w-5 text-muted-foreground"/>
                                            <span className="text-base font-medium">Archive project</span>
                                        </>


                                    }
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
