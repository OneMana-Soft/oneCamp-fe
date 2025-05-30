import {LucideIcon} from "lucide-react";

export interface DesktopChildrenNavType {

    title: string
    path: string
    variant?: "default" | "ghost"
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
