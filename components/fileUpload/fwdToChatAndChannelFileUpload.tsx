import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useEffect} from "react";
import { closeFwdMsgFileUpload} from "@/store/slice/fileUploadSlice";
import * as React from "react";
import {useUploadFile} from "@/hooks/useUploadFile";
import UploadingAttachmentIcon from "@/components/attachmentIcon/uploadingAttachmentIcon";
import {openMediaLightboxDialog} from "@/store/slice/dialogSlice";
import {GetEndpointUrl} from "@/services/endPoints";
import {AttachmentMediaReq} from "@/types/attachment";
import {deleteFwdMsgPreviewFiles, removeFwdMsgUploadedFiles} from "@/store/slice/fwdMessageSlice";


interface FwdToChatAndChannelFileUploadProps {
    channelUUIDs: string[]
    chatUUIDs: string[]

}

export const FwdToChatAndChannelFileUpload = ({channelUUIDs, chatUUIDs}: FwdToChatAndChannelFileUploadProps) => {
    const  fwdToChatAndChannelFileUploadOpen = useSelector((state: RootState) => state.fileUpload.fwdMsgFileUpload);

    const fwdToChatAndChannelFiles = useSelector((state: RootState) => state.fwdMsg.fwdMsgInputInputState || {});

    const dispatch = useDispatch();
    const uploadFile = useUploadFile()

    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFile = React.useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            console.log("dsfgsdfgsdfgdfg 555555555555")
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
            console.log("999999555555")
            fileInputRef.current.click();
            dispatch(closeFwdMsgFileUpload());
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

        dispatch(openMediaLightboxDialog({allMedia:  fwdToChatAndChannelFiles.filesUploaded, media: attachmentMedia, mediaGetUrl: (channelUUIDs[0] ? GetEndpointUrl.GetChannelMedia + '/' + channelUUIDs[0] : GetEndpointUrl.GetChatMedia + '/' + chatUUIDs[0])}))

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