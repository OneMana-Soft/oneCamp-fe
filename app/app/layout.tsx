"use client"

import {AppProtectedRoute} from "@/components/protectedRoute/appProtectedRoute";
import {
    closeCreateChannelDialog,
    closeCreateChatMessageDialog,
    closeCreateProjectDialog,
    closeCreateTeamDialog, closeForwardMessageDialog, closeMediaLightboxDialog,
    closeUpdateChannelDialog,
    closeUpdateChannelMemberDialog,
    closeUpdateUserStatusDialog
} from "@/store/slice/dialogSlice";
import UpdateStatusDialog from "@/components/dialog/updateUserStatusDialog";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {TooltipProvider} from "@/components/ui/tooltip";
import {useMedia} from "@/context/MediaQueryContext";
import {MobileNavigationBar} from "@/components/navigationBar/mobile/mobileNavigationBar";
import {DesktopNavigationBar} from "@/components/navigationBar/desktop/desktopNavigationBar";
import CreateChannelDialog from "@/components/dialog/createChannelDialog";
import CreateChatMessageDialog from "@/components/dialog/createChatMessageDialog";
import CreateProjectDialog from "@/components/dialog/createProjectDialog";
import CreateTeamDialog from "@/components/dialog/createTeamDialog";
import {Toaster} from "@/components/ui/toaster";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {cn} from "@/lib/utils/cn";
import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {ArrowRightToLine, ChevronLeft, ChevronRight, SendHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button";
import {toggleRightPanel} from "@/store/slice/rightPanelSlice";
import EditChannelDialog from "@/components/dialog/editChannelDialog";
import EditChannelMemberDialog from "@/components/dialog/editChannelMembers";
import {MediaLightboxDialog} from "@/components/dialog/attachmentLightboxDialog";
import {AttachmentMediaReq} from "@/types/attachment";
import {ForwardMessage} from "@/components/dialog/forwardMessage";

export default function AppLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const dispatch = useDispatch();
    const dialogState = useSelector((state: RootState) => state.dialog);


    const {isMobile} = useMedia()

    const rightPanelState = useSelector((state: RootState) => state.rightPanel.rightPanelState);

    return (
        <AppProtectedRoute>
            <TooltipProvider delayDuration={400}>
                {isMobile ?
                    (
                        <MobileNavigationBar>
                            {children}
                        </MobileNavigationBar>
                    ) :

                    (
                        <DesktopNavigationBar>
                            <ResizablePanelGroup
                                direction="horizontal"
                                onLayout={(sizes) => {
                                    document.cookie = `react-resizable-root-panels:layout:mail=${JSON.stringify(sizes)}`
                                }}
                                className="h-full"
                            >
                                <ResizablePanel defaultSize={60} className={cn("h-full")}>
                                    {children}
                                </ResizablePanel>
                                <ResizableHandle withHandle={ rightPanelState.isOpen}/>
                                <ResizablePanel
                                    defaultSize={30}
                                    minSize={30}
                                    maxSize={60}
                                    className={`overflow-y-auto transition-all duration-500 ease-in-out ${
                                        rightPanelState.isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                                    }`}
                                    style={{
                                        width:  rightPanelState.isOpen ? "30%" : "0%",
                                        minWidth:  rightPanelState.isOpen ? "30%" : "0%",
                                        maxWidth:  rightPanelState.isOpen ? "60%" : "0%",
                                    }}
                                >
                                    {/* Content for the right panel */}
                                    <div className="p-4">
                                        <div className='flex justify-between'>
                                            <h2 className="text-2xl font-bold mb-4">Right Panel Content</h2>
                                            <Button size='icon' variant='ghost' onClick={()=>{dispatch(toggleRightPanel())}}><ArrowRightToLine /></Button>

                                        </div>
                                        <p>This is the sliding right panel. You can add any content here.</p>
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>

                        </DesktopNavigationBar>


                    )
                }

                <UpdateStatusDialog
                    dialogOpenState={dialogState.updateUserStatusDialog.isOpen}
                    setOpenState={() => dispatch(closeUpdateUserStatusDialog())}
                    userUUID={dialogState.updateUserStatusDialog.data.userUUID}
                />

                <CreateChannelDialog
                    dialogOpenState={dialogState.createChannelDialog.isOpen}
                    setOpenState={() => dispatch(closeCreateChannelDialog())}
                />

                <CreateChatMessageDialog
                    dialogOpenState={dialogState.createChatMessageDialog.isOpen}
                    setOpenState={() => dispatch(closeCreateChatMessageDialog())}
                />

                <CreateProjectDialog
                    dialogOpenState={dialogState.createProjectDialog.isOpen}
                    setOpenState={() => dispatch(closeCreateProjectDialog())}
                />

                <CreateTeamDialog
                    dialogOpenState={dialogState.createTeamDialog.isOpen}
                    setOpenState={() => dispatch(closeCreateTeamDialog())}
                />

                <EditChannelDialog
                    channelId={dialogState.editChannelDialog.data.channelUUID}
                    dialogOpenState={dialogState.editChannelDialog.isOpen}
                    setOpenState={() => dispatch(closeUpdateChannelDialog())}
                />

                <EditChannelMemberDialog
                     channelId={dialogState.editChannelMemberDialog.data.channelUUID}
                     dialogOpenState={dialogState.editChannelMemberDialog.isOpen}
                     setOpenState={() => dispatch(closeUpdateChannelMemberDialog())}
                />

                <MediaLightboxDialog
                    dialogOpenState={dialogState.attachmentLightboxDialog.isOpen}
                    setOpenState={() => dispatch(closeMediaLightboxDialog())}
                    media={dialogState.attachmentLightboxDialog.data.media}
                    allMedia={dialogState.attachmentLightboxDialog.data.allMedia}
                    mediaGetUrl={dialogState.attachmentLightboxDialog.data.mediaGetUrl}
                />

                <ForwardMessage
                    chatUUID={dialogState.forwardMessageDialog.data.chatUUID}
                    channelUUID={dialogState.forwardMessageDialog.data.channelUUID}
                    postUUID={dialogState.forwardMessageDialog.data.postUUID}
                    onOpenChange={() => dispatch(closeForwardMessageDialog())}
                    open={dialogState.forwardMessageDialog.isOpen}
                />

                <Toaster />

            </TooltipProvider>

        </AppProtectedRoute>

    );
}
