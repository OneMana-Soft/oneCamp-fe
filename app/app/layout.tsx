"use client"

import {AppProtectedRoute} from "@/components/protectedRoute/appProtectedRoute";
import {
    closeConfirmAlertMessageDialog,
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
import EditChannelDialog from "@/components/dialog/editChannelDialog";
import EditChannelMemberDialog from "@/components/dialog/editChannelMembers";
import {MediaLightboxDialog} from "@/components/dialog/attachmentLightboxDialog";
import {ForwardMessage} from "@/components/dialog/forwardMessage";
import {RightPanel} from "@/components/rightPanel/rightPanel";
import {ConfirmAlertDialog} from "@/components/dialog/confirmAlertDialog";
import {MqttProvider} from "@/components/mqtt/mqttProvider";

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
                <MqttProvider>
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
                                <ResizablePanel defaultSize={60} className={cn("h-full relative")}>
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
                                        width:  rightPanelState.isOpen ? "10%" : "0%",
                                        minWidth:  rightPanelState.isOpen ? "10%" : "0%",
                                        maxWidth:  rightPanelState.isOpen ? "60%" : "0%",
                                    }}
                                >
                                    {/* Content for the right panel */}

                                        <RightPanel />
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

                <ConfirmAlertDialog
                    title={dialogState.confirmAlertDialog.data.title}
                    description={dialogState.confirmAlertDialog.data.description}
                    onConfirm={dialogState.confirmAlertDialog.data.onConfirm}
                    open={dialogState.confirmAlertDialog.isOpen}
                    onOpenChange={() => dispatch(closeConfirmAlertMessageDialog())}
                />

                <Toaster />
                </MqttProvider>

            </TooltipProvider>

        </AppProtectedRoute>

    );
}
