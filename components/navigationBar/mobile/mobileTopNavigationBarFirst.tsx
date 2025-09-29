"use client"

import {usePathname, useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {OrgAvatarNav} from "@/components/navigationBar/orgAvatarNav";
import {openOrgDrawer, } from "@/store/slice/drawerSlice";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";
import {app_channel_path} from "@/types/paths";

export function MobileTopNavigationBarFirst() {
    const router = useRouter();

    const path = usePathname().split('/')
    const dispatch = useDispatch();

    const renderComponent = () => {
        switch (path[2]) {
            case "task":
            case "chat":
            case "channel":
            case "forward":
            case "home":
                if(path.length < 4)
                return <div onClick={()=>{dispatch(openOrgDrawer())}}><OrgAvatarNav/></div>;
                if(path.length < 6)
                    return <Button variant='ghost' size='icon' onClick={()=>{router.back()}}><ArrowLeft className='h-5' /></Button>
                break;
            case "doc":
                return <Button variant='ghost' size='icon' onClick={()=>{router.back()}}><ArrowLeft className='h-5' /></Button>
            case "calls":
                return <Button variant='ghost' size='icon' onClick={()=>{router.back()}}><ArrowLeft className='h-5' /></Button>

            default:
                return <></>;
        }
    };

    return (
        <div className='flex justify-start'>
            {renderComponent()}
        </div>
    );
}