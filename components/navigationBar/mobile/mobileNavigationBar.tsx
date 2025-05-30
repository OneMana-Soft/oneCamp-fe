import {MobileTopNavigationBar} from "@/components/navigationBar/mobile/mobileTopNavigationBar";
import {MobileBottomNavigationBar} from "@/components/navigationBar/mobile/mobileBottomNavigationBar";
import {OrgDrawer} from "@/components/drawers/orgDrawer";
import {
    closeChannelMessageLongPressDrawer,
    closeChannelOptionsDrawer,
    closeDocFilterOptionsDrawer, closeDocOptionsDrawer, closeMyTaskOptionsDrawer,
    closeOrgDrawer, closeReactionPickerDrawer, closeTaskFilterDrawer, closeTaskOptionsDrawer,
    closeUserProfileDrawer
} from "@/store/slice/drawerSlice";
import {UserProfileDrawer} from "@/components/drawers/userProfileDrawer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {ChannelMobileSheet} from "@/components/sheets/channelMobileSheet";
import {closeChannelInfoSheet} from "@/store/slice/sheetSlice";
import {ChannelOptionsDrawer} from "@/components/drawers/channelOptionsDrawer";
import {DocFilterOptionsDrawer} from "@/components/drawers/docFilterOptionsDrawer";
import {DocOptionsDrawer} from "@/components/drawers/docOptionsDrawer";
import {EmojiPickerDrawer} from "@/components/drawers/emojiPickerDrawer";
import {TaskFilterDrawer} from "@/components/drawers/taskFilterDrawer";
import {TaskOptionsDrawer} from "@/components/drawers/taskOptionsDrawer";
import {MyTaskOptionsDrawer} from "@/components/drawers/myTaskOptionsDrawer";
import {ChannelMessageLongPressDrawer} from "@/components/drawers/channelMessageLongPressDrawer";

export function MobileNavigationBar({
                                              children,
                                          }: Readonly<{
    children: React.ReactNode;
}>) {

    const dispatch = useDispatch();
    const drawerState = useSelector((state: RootState) => state.drawer);
    const sheetState = useSelector((state: RootState) => state.sheet);

    return (
        <>
            <div className='flex flex-col h-full justify-between'>
                <MobileTopNavigationBar/>

                <div className='flex-1 overflow-y-auto'>
                    {children}

                </div>

                <MobileBottomNavigationBar />
            </div>

            <OrgDrawer
                drawerOpenState={drawerState.orgProfileDrawer.isOpen}
                setOpenState={() => dispatch(closeOrgDrawer())}
            />

            <UserProfileDrawer
                drawerOpenState={drawerState.userProfileDrawer.isOpen}
                setOpenState={() => dispatch(closeUserProfileDrawer())}
            />

            <ChannelOptionsDrawer
                drawerOpenState={drawerState.channelOptionsDrawer.isOpen}
                setOpenState={() => dispatch(closeChannelOptionsDrawer())}
                channelId={drawerState.channelOptionsDrawer.data.channelUUID}
            />

            <ChannelMobileSheet
                open={sheetState.channelInfoSheet.isOpen}
                onOpenChange={() => dispatch(closeChannelInfoSheet())}
                channelId={sheetState.channelInfoSheet.data.channelUUID}
            />

            <DocFilterOptionsDrawer
                drawerOpenState={drawerState.docFilterOptionsDrawer.isOpen}
                setOpenState={() => dispatch(closeDocFilterOptionsDrawer())}
            />

            <DocOptionsDrawer
                drawerOpenState={drawerState.docOptionsDrawer.isOpen}
                setOpenState={() => dispatch(closeDocOptionsDrawer())}

            />

            <EmojiPickerDrawer
                reactionDrawerOpenState={drawerState.reactionPickerDrawer.isOpen}
                setReactionDrawerOpenState={()=>dispatch(closeReactionPickerDrawer())}
                showCustomReactions={drawerState.reactionPickerDrawer.data.showCustomReactions}
                onReactionSelect={drawerState.reactionPickerDrawer.data.onReactionSelect}
            />

            <TaskFilterDrawer
                drawerOpenState={drawerState.taskFilterDrawer.isOpen}
                setOpenState={()=>dispatch(closeTaskFilterDrawer())}
            />

            <TaskOptionsDrawer
                drawerOpenState={drawerState.taskOptionsDrawer.isOpen}
                setOpenState={()=>dispatch(closeTaskOptionsDrawer())}
            />

            <MyTaskOptionsDrawer
                drawerOpenState={drawerState.myTaskOptionsDrawer.isOpen}
                setOpenState={()=>dispatch(closeMyTaskOptionsDrawer())}
            />

            <ChannelMessageLongPressDrawer
                drawerOpenState={drawerState.channelMessageLongPressDrawer.isOpen}
                setOpenState={()=>dispatch(closeChannelMessageLongPressDrawer())}
                onAddEmoji={drawerState.channelMessageLongPressDrawer.data.onAddReaction}
            />
        </>

    );
}