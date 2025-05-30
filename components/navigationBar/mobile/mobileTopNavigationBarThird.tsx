"use client"

import {usePathname} from "next/navigation";
import {UserStatusNav} from "@/components/navigationBar/userStatusNav";
import {UserAvatarNav} from "@/components/navigationBar/userAvatarNav";
import {useDispatch} from "react-redux";
import {
    openChannelOptionsDrawer,
    openDocFilterOptionsDrawer,
    openDocOptionsDrawer,
    openMyTaskOptionsDrawer,
    openTaskFilterDrawer,
    openTaskOptionsDrawer,
    openUserProfileDrawer
} from "@/store/slice/drawerSlice";
import {Button} from "@/components/ui/button";
import {openCreateChannelDialog, openCreateChatMessageDialog} from "@/store/slice/dialogSlice";
import {ArrowUpDown, CircleCheck, Ellipsis, Filter, Link, PanelRight, Plus,} from "lucide-react";
import {openChannelInfoSheet} from "@/store/slice/sheetSlice";
import {DocSharePopover} from "@/components/popover/docSharePopover";
import {DocCommentPopover} from "@/components/popover/docCommentPopover";

export function MobileTopNavigationBarThird() {


    const path = usePathname().split('/')
    const dispatch = useDispatch();


    const renderComponent = () => {
        switch (path[2]) {
            case "home":
                return <div className='flex space-x-6 justify-end '>
                    <UserStatusNav/>
                    <div onClick={()=>{dispatch(openUserProfileDrawer())}}>
                        <UserAvatarNav/>
                    </div>
                </div>;
            case "task":

                if(path.length < 4)
                    return <div className='flex space-x-1'>
                        <Button variant='ghost' size='icon' onClick={()=>{dispatch(openTaskFilterDrawer())}}><Filter className='h-5'/></Button>
                        <Button variant='ghost' size='icon' onClick={()=>{dispatch(openMyTaskOptionsDrawer())}}><Ellipsis className='h-5'/></Button>
                    </div>
                if(path.length < 5)
                    return <div className='flex space-x-1'>
                        <Button variant='ghost' size='icon' ><CircleCheck /></Button>
                        <Button variant='ghost' size='icon' ><Link /></Button>
                        <Button variant='ghost' size='icon' onClick={()=>{dispatch(openTaskOptionsDrawer())}}><Ellipsis className='h-5'/></Button>
                    </div>
            case "channel":

                if(path.length < 4)
                    return <Button className={'!no-underline'} variant='link' onClick={()=>{dispatch(openCreateChannelDialog())}} >New</Button>
                if(path.length < 5)
                    return <div className='flex space-x-1'>
                        <Button variant='ghost' size='icon' onClick={()=>{dispatch(openChannelOptionsDrawer({channelUUID: path[3]}))}}><Ellipsis className='h-5'/></Button>
                        <Button variant='ghost' size='icon' onClick={()=>{dispatch(openChannelInfoSheet({channelUUID: path[3]}))}}><PanelRight className='h-5'/></Button>
                        </div>
            case "doc":
                if(path.length < 4)
                    return <Button variant='ghost' size='icon' onClick={()=>{dispatch(openDocFilterOptionsDrawer())}}><ArrowUpDown className='h-5'/></Button>
                if(path.length < 5)
                    return <div className='flex justify-end space-x-1'>
                        <DocSharePopover/>
                        <DocCommentPopover/>
                        <Button variant='ghost' size='icon' onClick={()=>{dispatch(openDocOptionsDrawer())}}><Ellipsis className='h-5'/></Button>

                    </div>
            case "chat":
                return  <Button size='icon' variant='ghost' onClick={()=>(dispatch(openCreateChatMessageDialog()))}><Plus className='h-5'/></Button>

            default:
                return <></>;
        }
    };

    return (
        <div className='flex justify-end items-center'>
            {renderComponent()}
        </div>
    );
}