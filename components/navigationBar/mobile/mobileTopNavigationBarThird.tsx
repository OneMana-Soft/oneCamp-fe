"use client"

import {usePathname} from "next/navigation";
import {UserStatusNav} from "@/components/navigationBar/userStatusNav";
import {UserAvatarNav} from "@/components/navigationBar/userAvatarNav";
import {useDispatch, useSelector} from "react-redux";
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
import {ArrowUpDown, CircleCheck, Ellipsis, Filter, Link, PanelRight, Plus, SendHorizontal,} from "lucide-react";
import {openChannelInfoSheet} from "@/store/slice/sheetSlice";
import {DocSharePopover} from "@/components/popover/docSharePopover";
import {DocCommentPopover} from "@/components/popover/docCommentPopover";
import {RootState} from "@/store/store";
import {clickedMobileFwdMsgSend} from "@/store/slice/fwdMessageSlice";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserProfileInterface} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";
import {useEffect} from "react";
import {updateUserEmojiStatus} from "@/store/slice/userSlice";

export function MobileTopNavigationBarThird() {


    const path = usePathname().split('/')
    const dispatch = useDispatch();

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const fwdMsgSendClicked = useSelector((state: RootState) => state.fwdMsg.fwdMsgInputInputState.mobileViewSendClicked);



    const renderComponent = () => {
        switch (path[2]) {
            case "home":
                return <div className='flex space-x-6 justify-end '>
                    <UserStatusNav userUUID={selfProfile.data?.data.user_uuid || ''}/>
                    <div onClick={()=>{dispatch(openUserProfileDrawer())}}>
                        <UserAvatarNav userName={selfProfile.data?.data.user_name} userProfileObjKey={selfProfile.data?.data.user_profile_object_key}/>
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
                break
            case "channel":

                if(path.length < 4)
                    return <Button className={'!no-underline'} variant='link' onClick={()=>{dispatch(openCreateChannelDialog())}} >New</Button>
                if(path.length < 5)
                    return <div className='flex space-x-1'>
                        <Button variant='ghost' size='icon' onClick={()=>{dispatch(openChannelOptionsDrawer({channelUUID: path[3]}))}}><Ellipsis className='h-5'/></Button>
                        <Button variant='ghost' size='icon' onClick={()=>{dispatch(openChannelInfoSheet({channelUUID: path[3]}))}}><PanelRight className='h-5'/></Button>
                        </div>
                break
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
                if(path.length < 4)
                return  <Button size='icon' variant='ghost' onClick={()=>(dispatch(openCreateChatMessageDialog()))}><Plus className='h-5'/></Button>
                break;

            case "forward":

                return  <Button disabled={fwdMsgSendClicked} size='icon' variant='ghost' onClick={()=>(dispatch(clickedMobileFwdMsgSend()))}><SendHorizontal  className='h-5'/></Button>


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