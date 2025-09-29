import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useEffect} from "react";
import {closeChannelFileUpload, closeChatFileUpload} from "@/store/slice/fileUploadSlice";
import * as React from "react";
import {useUploadFile} from "@/hooks/useUploadFile";
import UploadingAttachmentIcon from "@/components/attachmentIcon/uploadingAttachmentIcon";
import {openMediaLightboxDialog} from "@/store/slice/dialogSlice";
import {GetEndpointUrl} from "@/services/endPoints";
import {AttachmentMediaReq} from "@/types/attachment";
import {deleteChatPreviewFiles, removeChatUploadedFiles} from "@/store/slice/chatSlice";
import {getGroupingId} from "@/lib/utils/getGroupingId";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserProfileInterface} from "@/types/user";

interface ChatFileUploadProps {
    chatUUID: string;
}

export const ChatFileUpload = ({chatUUID}:ChatFileUploadProps) => {

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const chatFileUploadOpen = useSelector((state: RootState) => state.fileUpload.chatFileUpload);

    const chatFiles = useSelector((state: RootState) => state.chat.chatInputState[chatUUID] || {});

    const dispatch = useDispatch();
    const uploadFile = useUploadFile()

    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const grpId = getGroupingId(chatUUID, selfProfile.data?.data.user_uuid || '')

    const handleFile = React.useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (!files?.length) return

            await uploadFile.makeRequestToUploadToChat(files, chatUUID, grpId)

            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the input
            }

        },
        [chatUUID, uploadFile]
    )

    useEffect(() => {

        if (chatFileUploadOpen.isOpen) {
            fileInputRef.current?.click()
            dispatch(closeChatFileUpload())
        }

    }, [chatFileUploadOpen]);

    const removeProjectPreviewFile = (key: string) => {
        dispatch(
            deleteChatPreviewFiles({
                key,
                chatUUID
            })
        );
        dispatch(
            removeChatUploadedFiles({
                key,
                chatUUID
            })
        );
    }


    const handleAttachmentIconCLick = (uploadProgress: number, key: string) => {
        if (uploadProgress != 100) {
            return
        }




        const attachmentMedia = chatFiles.filesUploaded.find((uploadFile)=> uploadFile.attachment_obj_key == key) || {} as AttachmentMediaReq

        dispatch(openMediaLightboxDialog({allMedia:  chatFiles.filesUploaded, media: attachmentMedia, mediaGetUrl: GetEndpointUrl.GetChatMedia + '/' + chatUUID}))

    }


    return (
        <div className='flex flex-wrap'>
            {
                chatFiles.filesPreview?.map((pfile)=>{
                    return <UploadingAttachmentIcon
                        fileName={pfile.fileName}
                        progress={pfile.progress}
                        fileKey={pfile.key}
                        removeFile={()=>{removeProjectPreviewFile(pfile.key)}}
                        key={pfile.key}
                        getUrl={pfile.uuid?(GetEndpointUrl.GetChatMedia + '/' + chatUUID + '/' + pfile.uuid):undefined}
                        attachmentOnCLick={()=>{handleAttachmentIconCLick(pfile.progress, pfile.key)}}
                        attachmentType={pfile.attachmentType}/>
                })
            }

            <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFile}/>
        </div>
    )

}