"use client"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ChannelMemberContent from "@/components/member/channelMemberContent";


interface EditTeamDialogProps {
    dialogOpenState: boolean;
    setOpenState: (state: boolean) => void;
    channelId: string
}

const EditChannelMemberDialog: React.FC<EditTeamDialogProps> = ({
                                                              dialogOpenState,
                                                              setOpenState,
                                                              channelId
                                                          }) => {


    const closeModal = () => {
        setOpenState(false);
    };



    return (
        <Dialog onOpenChange={closeModal} open={dialogOpenState} >
            <DialogContent className="max-w-[95vw] md:max-w-[30vw]">
                <DialogHeader>
                    <DialogTitle className="text-start">Channel members</DialogTitle>
                    <DialogDescription className="hidden">
                        Channel members
                    </DialogDescription>
                </DialogHeader>
                <ChannelMemberContent channelId={channelId} />
            </DialogContent>
        </Dialog>
    );
};

export default EditChannelMemberDialog;