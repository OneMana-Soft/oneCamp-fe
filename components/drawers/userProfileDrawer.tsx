"use client"

import * as React from "react"
import {CircleUser, LogOut} from "lucide-react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"


interface profileDrawerDrawerProps {
    drawerOpenState: boolean;
    setOpenState: (state: boolean) => void;
}

export function UserProfileDrawer({drawerOpenState, setOpenState}:profileDrawerDrawerProps) {


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
                            <div
                                className='w-full h-12 flex space-x-3 items-center'
                            >
                                <CircleUser/>
                                <span>My Profile</span>
                            </div>
                            <div
                                className='w-full h-12 flex space-x-3 items-center'
                            >
                                <LogOut />
                                <span >Sign out</span>
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
