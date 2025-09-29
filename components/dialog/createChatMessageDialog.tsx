"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {ForwardMessageDropdown} from "@/components/searchDropdown/fwdMsgToDropdown/fwdMsgToDropdown";
import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {cn} from "@/lib/utils/cn";
import {createOrUpdateFwdMsg} from "@/store/slice/fwdMessageSlice";
import {MessagePreview} from "@/components/message/MessagePreview";
import {LoaderCircle} from "lucide-react";
import * as React from "react";
import {
  SelectUserToMessageDropdown
} from "@/components/searchDropdown/selectUserToMessageDropdown/selectUserToMessageDropdown";
import {useState} from "react";
import {UserProfileDataInterface} from "@/types/user";
import {app_chat_path} from "@/types/paths";
import {useRouter} from "next/navigation";


interface updateUserStatusDialogProps {
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
}

const CreateChatMessageDialog: React.FC<updateUserStatusDialogProps> = ({
  dialogOpenState,
  setOpenState,
}) => {

  const router = useRouter();

  const [selectedUser, setSelectedUser] = useState<UserProfileDataInterface| null>(null)

  const handleSendMessage = () => {

    router.push(app_chat_path + '/' + selectedUser?.user_uuid);
    closeModal()

  }

  function closeModal() {
    setOpenState(false);
  }

  return (
      <Dialog open={dialogOpenState} onOpenChange={closeModal}  >
        <DialogContent className="max-w-[95vw] md:max-w-[35vw] space-y-2.5">
          <DialogHeader>
            <DialogTitle>Find users</DialogTitle>
            <DialogDescription >
            </DialogDescription>
          </DialogHeader>

          <SelectUserToMessageDropdown onSelect={setSelectedUser}/>

          <DialogFooter>
            <Button onClick={handleSendMessage}
                    disabled={selectedUser == null}
            >

              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>


      </Dialog>
  );
};

export default CreateChatMessageDialog;
