"use client"

import * as React from "react"
import { Moon, Sun, CircleUser, LogOut } from "lucide-react"
import { useLogout } from "@/hooks/useLogout"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { openUI } from "@/store/slice/uiSlice"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

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

export function UserProfileDrawer({ drawerOpenState, setOpenState }: profileDrawerDrawerProps) {
    const { logout } = useLogout();
    const dispatch = useDispatch();
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    function closeDrawer() {
        setOpenState(false);
    }

    function handleProfileClick() {
        router.push('/app/profile');
        closeDrawer();
    }

    function handleThemeToggle() {
        setTheme(theme === "dark" ? "light" : "dark");
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
                                onClick={handleProfileClick}
                            >
                                <CircleUser className="h-5 w-5 text-muted-foreground" />
                                <span className="text-base font-medium">My Profile</span>
                            </div>

                            <div
                                className='w-full h-14 flex space-x-4 items-center justify-between cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
                                onClick={handleThemeToggle}
                            >
                                <div className="flex space-x-4 items-center">
                                    {theme === "dark" ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
                                    <span className="text-base font-medium">Dark Mode</span>
                                </div>
                                <Switch 
                                    checked={theme === "dark"} 
                                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                    onClick={(e) => e.stopPropagation()} 
                                />
                            </div>

                            <div
                                className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-destructive/10 text-destructive rounded-xl px-4 mt-2'
                                onClick={logout}
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="text-base font-medium">Sign out</span>
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
