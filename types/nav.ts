import {LucideIcon} from "lucide-react";
import {UserProfileDataInterface} from "@/types/user";

export interface DesktopChildrenNavType {

    title: string
    path: string
    variant?: "default" | "ghost"
    unread_count?:number
    userProfile?: UserProfileDataInterface
}

export interface DesktopNavType {
        title: string;
        label?: string;
        icon?: LucideIcon;
        variant?: "default" | "ghost";
        path?: string;
        action?:(()=>void)|undefined
        isOpen?: boolean;
        setIsOpen?:(b:boolean)=>void
        children?:DesktopChildrenNavType[]
}
