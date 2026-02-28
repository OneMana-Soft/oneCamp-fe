"use client"

import * as React from "react"
import {CircleUser, Link, Trash, Trash2, Users} from "lucide-react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {useCallback} from "react";
import {app_task_path} from "@/types/paths";
import {useCopyToClipboard} from "@/hooks/useCopyToClipboard";
import {CreateTaskInterface, TaskInfoRawInterface} from "@/types/task";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {usePost} from "@/hooks/usePost";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {isZeroEpoch} from "@/lib/utils/validation/isZeroEpoch";


interface orgDrawerDrawerProps {
    drawerOpenState: boolean;
    setOpenState: (state: boolean) => void;
    taskId: string
}

export function TaskDrawer({drawerOpenState, setOpenState, taskId}:orgDrawerDrawerProps) {

    const copyToClipboard = useCopyToClipboard()
    const post = usePost()
    const taskInfo = useFetchOnlyOnce<TaskInfoRawInterface>(taskId ? `${GetEndpointUrl.GetTaskInfo}/${taskId}` : "")


    const copyTaskLink = useCallback(
        ()=>{
            const host = window.location.host;
            const protocol = window.location.protocol;
            const baseUrl = `${protocol}//${host}`;
            const newPath = `${app_task_path}/${taskId}`

            copyToClipboard.copy(`${baseUrl}${newPath}`, 'copied link')

            closeDrawer()
        },[taskId]
    )

    const handleDeleteTask = useCallback(
        () => {
            post.makeRequest<CreateTaskInterface>({
                apiEndpoint:PostEndpointUrl.ArchiveTask,
                payload: {
                    task_uuid: taskId,
                }
            }).then(() => {
                taskInfo.mutate()
            })
            closeDrawer()
        },
        [taskId],
    )

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
                    <div className="p-4 pb-6">
                        <div className="flex flex-col items-center justify-start space-y-1">
                            <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={copyTaskLink}
                            >
                                <Link className="h-5 w-5 text-muted-foreground" />
                                <span className="text-base font-medium">Copy task link</span>
                            </div>
                            {isZeroEpoch(taskInfo.data?.data.task_deleted_at || '') && <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-destructive/10 text-destructive rounded-xl px-4 mt-2'
                                onClick={handleDeleteTask}
                            >
                                <Trash2 className="h-5 w-5"/>
                                <span className="text-base font-medium">Delete task</span>
                            </div>}
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
