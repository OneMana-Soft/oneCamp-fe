import {MobileTopNavigationBar} from "@/components/navigationBar/mobile/mobileTopNavigationBar";
import {MobileBottomNavigationBar} from "@/components/navigationBar/mobile/mobileBottomNavigationBar";
import {OrgDrawer} from "@/components/drawers/orgDrawer";
import {
    closeChannelMessageLongPressDrawer,
    closeChannelOptionsDrawer,
    closeChatMessageLongPressDrawer,
    closeDmChatCommentMessageLongPressDrawer,
    closeDmChatMessageLongPressDrawer,
    closeDocFilterOptionsDrawer,
    closeDocOptionsDrawer,
    closeMyTaskOptionsDrawer,
    closeOrgDrawer,
    closePostCommentMessageLongPressDrawer,
    closePostMessageLongPressDrawer,
    closeReactionPickerDrawer,
    closeTaskFilterDrawer,
    closeTaskOptionsDrawer,
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
import {PostCommentMessageLongPressDrawer} from "@/components/drawers/postCommentMessageLongPressDrawer";
import {ChatMessageLongPressDrawer} from "@/components/drawers/chatMessageLongPressDrawer";
import {DmChatMessageLongPressDrawer} from "@/components/drawers/dmChatMessageLongPressDrawer";
import {DmChatCommentMessageLongPressDrawer} from "@/components/drawers/dmChatCommentMessageLongPressDrawer";
import {PostMessageLongPressDrawer} from "@/components/drawers/postMessageLongPressDrawer";

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
                channelUUID={drawerState.channelMessageLongPressDrawer.data.channelUUID}
                postUUID={drawerState.channelMessageLongPressDrawer.data.postUUID}
                editMessage={drawerState.channelMessageLongPressDrawer.data.editMessage}
                deleteMessage={drawerState.channelMessageLongPressDrawer.data.deleteMessage}
                isAdmin={drawerState.channelMessageLongPressDrawer.data.isAdmin}
                isOwner={drawerState.channelMessageLongPressDrawer.data.isOwner}
                handleEmojiClick={drawerState.channelMessageLongPressDrawer.data.handleEmojiClick}
                copyTextToClipboard={drawerState.channelMessageLongPressDrawer.data.copyTextToClipboard}
            />

            <ChatMessageLongPressDrawer
                drawerOpenState={drawerState.chatMessageLongPressDrawer.isOpen}
                setOpenState={()=>dispatch(closeChatMessageLongPressDrawer())}
                onAddEmoji={drawerState.chatMessageLongPressDrawer.data.onAddReaction}
                otherUserUUID={drawerState.chatMessageLongPressDrawer.data.otherUserUUID}
                chatUUID={drawerState.chatMessageLongPressDrawer.data.chatUUID}
                editMessage={drawerState.chatMessageLongPressDrawer.data.editMessage}
                deleteMessage={drawerState.chatMessageLongPressDrawer.data.deleteMessage}
                isAdmin={drawerState.chatMessageLongPressDrawer.data.isAdmin}
                isOwner={drawerState.chatMessageLongPressDrawer.data.isOwner}
                handleEmojiClick={drawerState.chatMessageLongPressDrawer.data.handleEmojiClick}
                copyTextToClipboard={drawerState.chatMessageLongPressDrawer.data.copyTextToClipboard}
            />

            <PostMessageLongPressDrawer
                drawerOpenState={drawerState.postMessageLongPressDrawer.isOpen}
                setOpenState={()=>dispatch(closePostMessageLongPressDrawer())}
                onAddEmoji={drawerState.postMessageLongPressDrawer.data.onAddReaction}
                channelUUID={drawerState.postMessageLongPressDrawer.data.channelUUID}
                postUUID={drawerState.postMessageLongPressDrawer.data.postUUID}
                copyTextToClipboard={drawerState.postMessageLongPressDrawer.data.copyTextToClipboard}
                deleteMessage={drawerState.postMessageLongPressDrawer.data.deleteMessage}
                editMessage={drawerState.postMessageLongPressDrawer.data.editMessage}
                handleEmojiClick={drawerState.postMessageLongPressDrawer.data.handleEmojiClick}
                isOwner={drawerState.postMessageLongPressDrawer.data.isOwner}
                isAdmin={drawerState.postMessageLongPressDrawer.data.isAdmin}
            />

            <DmChatMessageLongPressDrawer
                drawerOpenState={drawerState.dmChatMessageLongPressDrawer.isOpen}
                setOpenState={()=>dispatch(closeDmChatMessageLongPressDrawer())}
                onAddEmoji={drawerState.dmChatMessageLongPressDrawer.data.onAddReaction}
                otherUserUUID={drawerState.dmChatMessageLongPressDrawer.data.chatUUID}
                chatUUID={drawerState.dmChatMessageLongPressDrawer.data.chatMessageUUID}
                copyTextToClipboard={drawerState.dmChatMessageLongPressDrawer.data.copyTextToClipboard}
                deleteMessage={drawerState.dmChatMessageLongPressDrawer.data.deleteMessage}
                editMessage={drawerState.dmChatMessageLongPressDrawer.data.editMessage}
                handleEmojiClick={drawerState.dmChatMessageLongPressDrawer.data.handleEmojiClick}
                isOwner={drawerState.dmChatMessageLongPressDrawer.data.isOwner}
                isAdmin={drawerState.dmChatMessageLongPressDrawer.data.isAdmin}
            />

            <PostCommentMessageLongPressDrawer
                drawerOpenState={drawerState.postCommentMessageLongPressDrawer.isOpen}
                setOpenState={()=>dispatch(closePostCommentMessageLongPressDrawer())}
                onAddEmoji={drawerState.postCommentMessageLongPressDrawer.data.onAddReaction}
                copyTextToClipboard={drawerState.postCommentMessageLongPressDrawer.data.copyTextToClipboard}
                editMessage={drawerState.postCommentMessageLongPressDrawer.data.editMessage}
                deleteMessage={drawerState.postCommentMessageLongPressDrawer.data.deleteMessage}
                handleEmojiClick={drawerState.postCommentMessageLongPressDrawer.data.handleEmojiClick}
                isOwner={drawerState.postCommentMessageLongPressDrawer.data.isOwner}
                isAdmin={drawerState.postCommentMessageLongPressDrawer.data.isAdmin}
            />

            <DmChatCommentMessageLongPressDrawer
                drawerOpenState={drawerState.dmChatCommentMessageLongPressDrawer.isOpen}
                setOpenState={()=>dispatch(closeDmChatCommentMessageLongPressDrawer())}
                onAddEmoji={drawerState.dmChatCommentMessageLongPressDrawer.data.onAddReaction}
                copyTextToClipboard={drawerState.dmChatCommentMessageLongPressDrawer.data.copyTextToClipboard}
                deleteMessage={drawerState.dmChatCommentMessageLongPressDrawer.data.deleteMessage}
                editMessage={drawerState.dmChatCommentMessageLongPressDrawer.data.editMessage}
                handleEmojiClick={drawerState.dmChatCommentMessageLongPressDrawer.data.handleEmojiClick}
            />

        </>

    );
}