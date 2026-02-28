import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useEffect} from "react";
import {closeUI} from "@/store/slice/uiSlice";
import * as React from "react";
import {useUploadFile} from "@/hooks/useUploadFile";
import UploadingAttachmentIcon from "@/components/attachmentIcon/uploadingAttachmentIcon";
import {openUI} from "@/store/slice/uiSlice";
import {GetEndpointUrl} from "@/services/endPoints";
import {AttachmentMediaReq} from "@/types/attachment";
import {
    deleteChannelCommentMsgPreviewFiles,
    removeChannelCommentMsgUploadedFiles
} from "@/store/slice/channelCommentSlice";

interface ChannelFileUploadProps {
    channelId: string;
}

export const ChannelCommentFileUpload = ({channelId}:ChannelFileUploadProps) => {
    const channelFileUploadOpen = useSelector((state: RootState) => state.ui.channelCommentFileUpload);

    const EMPTY_INPUT_STATE = {};

    const channelFiles = useSelector((state: RootState) => state.channelComment.commentInputState[channelId] || EMPTY_INPUT_STATE);

    const dispatch = useDispatch();
    const uploadFile = useUploadFile()

    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFile = React.useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (!files?.length) return

            await uploadFile.makeRequestToUploadToChannelComment(files, channelId)

            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the input
            }

        },
        [channelId, uploadFile]
    )

    useEffect(() => {

        if (channelFileUploadOpen.isOpen) {
            fileInputRef.current?.click()
            dispatch(closeUI('channelCommentFileUpload'))
        }

    }, [ channelFileUploadOpen]);

    const removeProjectPreviewFile = (key: string) => {
        dispatch(
            deleteChannelCommentMsgPreviewFiles({
                key,
                channelId
            })
        );
        dispatch(
            removeChannelCommentMsgUploadedFiles({
                key,
                channelId
            })
        );
    }


    const handleAttachmentIconCLick = (uploadProgress: number, key: string) => {
        if (uploadProgress != 100) {
            return
        }




        const attachmentMedia = channelFiles.filesUploaded.find((uploadFile)=> uploadFile.attachment_obj_key == key) || {} as AttachmentMediaReq

        dispatch(openUI({
            key: 'attachmentLightbox',
            data: {allMedia:  channelFiles.filesUploaded, media: attachmentMedia, mediaGetUrl: GetEndpointUrl.GetChannelMedia + '/' + channelId}
        }))

    }

    return (
        <div className='flex flex-wrap'>
            {
                channelFiles.filesPreview?.map((pfile)=>{
                    return <UploadingAttachmentIcon
                        fileName={pfile.fileName}
                        progress={pfile.progress}
                        fileKey={pfile.key}
                        removeFile={()=>{removeProjectPreviewFile(pfile.key)}}
                        key={pfile.key}
                        getUrl={pfile.uuid?(GetEndpointUrl.GetChannelMedia + '/' + channelId + '/' + pfile.uuid):undefined}
                        attachmentOnCLick={()=>{handleAttachmentIconCLick(pfile.progress, pfile.key)}}
                        attachmentType={pfile.attachmentType}/>
                })
            }

            <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFile}/>
        </div>
    )

}