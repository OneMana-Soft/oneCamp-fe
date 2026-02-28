import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useEffect} from "react";
import { closeUI } from "@/store/slice/uiSlice";
import * as React from "react";
import {useUploadFile} from "@/hooks/useUploadFile";
import UploadingAttachmentIcon from "@/components/attachmentIcon/uploadingAttachmentIcon";
import {openUI} from "@/store/slice/uiSlice";
import {GetEndpointUrl} from "@/services/endPoints";
import {AttachmentMediaReq} from "@/types/attachment";
import {deleteFwdMsgPreviewFiles, removeFwdMsgUploadedFiles} from "@/store/slice/fwdMessageSlice";


interface FwdToChatAndChannelFileUploadProps {
    channelUUIDs: string[]
    chatUUIDs: string[]

}

export const FwdToChatAndChannelFileUpload = ({channelUUIDs, chatUUIDs}: FwdToChatAndChannelFileUploadProps) => {
    const  fwdToChatAndChannelFileUploadOpen = useSelector((state: RootState) => state.ui.fwdMsgFileUpload);

    const fwdToChatAndChannelFiles = useSelector((state: RootState) => state.fwdMsg.fwdMsgInputInputState || {});

    const dispatch = useDispatch();
    const uploadFile = useUploadFile()

    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFile = React.useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            const files = e.target.files;
            if (!files?.length) return;

            await uploadFile.makeRequestToUploadToChatAndChannels(files, chatUUIDs, channelUUIDs);

            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the input after processing
            }
        },
        [chatUUIDs, channelUUIDs, uploadFile]
    );

    useEffect(() => {
        if (fwdToChatAndChannelFileUploadOpen.isOpen && fileInputRef.current) {
            fileInputRef.current.click();
            dispatch(closeUI('fwdMsgFileUpload'));
        }
    }, [fwdToChatAndChannelFileUploadOpen.isOpen, dispatch]);


    const removeProjectPreviewFile = (key: string) => {
        dispatch(
            deleteFwdMsgPreviewFiles({
                key,

            })
        );
        dispatch(
            removeFwdMsgUploadedFiles({
                key,
            })
        );
    }


    const handleAttachmentIconCLick = (uploadProgress: number, key: string) => {
        if (uploadProgress != 100) {
            return
        }


        const attachmentMedia = fwdToChatAndChannelFiles.filesUploaded.find((uploadFile)=> uploadFile.attachment_obj_key == key) || {} as AttachmentMediaReq

        dispatch(openUI({
            key: 'attachmentLightbox',
            data: {allMedia:  fwdToChatAndChannelFiles.filesUploaded, media: attachmentMedia, mediaGetUrl: (channelUUIDs[0] ? GetEndpointUrl.GetChannelMedia + '/' + channelUUIDs[0] : GetEndpointUrl.GetChatMedia + '/' + chatUUIDs[0])}
        }))

    }

    return (
        <div className='flex flex-wrap'>
            {
                fwdToChatAndChannelFiles.filesPreview?.map((pfile)=>{
                    return <UploadingAttachmentIcon
                        fileName={pfile.fileName}
                        progress={pfile.progress}
                        fileKey={pfile.key}
                        removeFile={()=>{removeProjectPreviewFile(pfile.key)}}
                        key={pfile.key}
                        getUrl={pfile.uuid?(channelUUIDs ? GetEndpointUrl.GetChannelMedia + '/' + channelUUIDs[0] + '/' + pfile.uuid: GetEndpointUrl.GetChatMedia + '/' + chatUUIDs[0] + '/' + pfile.uuid):undefined}
                        attachmentOnCLick={()=>{handleAttachmentIconCLick(pfile.progress, pfile.key)}}
                        attachmentType={pfile.attachmentType}/>
                })
            }

            <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFile}/>
        </div>
    )

}