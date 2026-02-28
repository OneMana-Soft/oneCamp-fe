"use client"

import * as React from "react"
import {CircleUser, ClipboardList, Plus, Users} from "lucide-react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {useRouter} from "next/navigation";
import {app_create_task_path, app_my_task_path, app_project_path, app_team_path} from "@/types/paths";


interface myTaskOptionsDrawerProps {
    drawerOpenState: boolean;
    setOpenState: (state: boolean) => void;
}

export function MyTaskOptionsDrawer({drawerOpenState, setOpenState}: myTaskOptionsDrawerProps) {

    const router = useRouter()
    function closeDrawer() {
        setOpenState(false);
    }

    const handleCreateTask = () => {
        router.push(app_create_task_path);
        closeDrawer()
    }

    const handleTeamClick = () => {
        router.push(app_team_path);
        closeDrawer()
    }

    const handleProjectClick = () => {
        router.push(app_project_path);
        closeDrawer()
    }

    return (
        <Drawer  onOpenChange={closeDrawer} open={drawerOpenState}>
            <DrawerContent>
                <div className=" w-full mb-6">
                    <DrawerHeader className='hidden'>
                        <DrawerTitle></DrawerTitle>
                        <DrawerDescription></DrawerDescription>

                    </DrawerHeader>
                    <div className="p-4 pb-6">
                        <div className="flex flex-col items-center justify-start space-y-1">
                            <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={handleCreateTask}
                            >
                                <Plus className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-base font-medium">Create Task</span>
                            </div>
                            <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={handleTeamClick}
                            >
                                <Users className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-base font-medium">Teams</span>
                            </div>

                            <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={handleProjectClick}
                            >
                                <ClipboardList className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-base font-medium">Projects</span>
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
