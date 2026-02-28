"use client"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import DmMemberContent from "@/components/member/dmMemberContent";


interface EditDmDialogProps {
    dialogOpenState: boolean;
    setOpenState: (state: boolean) => void;
    grpId: string
}

const EditDmMemberDialog: React.FC<EditDmDialogProps> = ({
                                                              dialogOpenState,
                                                              setOpenState,
                                                              grpId
                                                          }) => {


    const closeModal = () => {
        setOpenState(false);
    };



    return (
        <Dialog onOpenChange={closeModal} open={dialogOpenState} >
            <DialogContent className="max-w-[95vw] md:max-w-[30vw]">
                <DialogHeader>
                    <DialogTitle className="text-start">Group members</DialogTitle>
                    <DialogDescription className="hidden">
                        Group members
                    </DialogDescription>
                </DialogHeader>
                <DmMemberContent grpId={grpId} />
            </DialogContent>
        </Dialog>
    );
};

export default EditDmMemberDialog;