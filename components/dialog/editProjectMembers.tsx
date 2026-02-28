"use client"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ChannelMemberContent from "@/components/member/channelMemberContent";
import {ProjectMemberContent} from "@/components/member/projectMemberContent";


interface EditTeamDialogProps {
    dialogOpenState: boolean;
    setOpenState: (state: boolean) => void;
    projectId: string
}

const EditProjectMemberDialog: React.FC<EditTeamDialogProps> = ({
                                                              dialogOpenState,
                                                              setOpenState,
                                                              projectId
                                                          }) => {


    const closeModal = () => {
        setOpenState(false);
    };



    return (
        <Dialog onOpenChange={closeModal} open={dialogOpenState}>
            <DialogContent className="max-w-[95vw] md:max-w-[30vw]">
                <DialogHeader>
                    <DialogTitle className="text-start">Project members</DialogTitle>
                    <DialogDescription className="hidden">
                        Project members
                    </DialogDescription>
                </DialogHeader>
                <ProjectMemberContent projectId={projectId} />
            </DialogContent>
        </Dialog>
    );
};

export default EditProjectMemberDialog;