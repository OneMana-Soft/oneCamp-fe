import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useEffect} from "react";
import {closeChannelFileUpload} from "@/store/slice/fileUploadSlice";
import * as React from "react";
import {useUploadFile} from "@/hooks/useUploadFile";
import  {deleteChannelPreviewFiles, removeChannelUploadedFiles} from "@/store/slice/channelSlice";
import UploadingAttachmentIcon from "@/components/attachmentIcon/uploadingAttachmentIcon";
import {openMediaLightboxDialog} from "@/store/slice/dialogSlice";
import {GetEndpointUrl} from "@/services/endPoints";
import {AttachmentMediaReq} from "@/types/attachment";

interface ChannelFileUploadProps {
    channelId: string;
}

export const ChannelFileUpload = ({channelId}:ChannelFileUploadProps) => {
    const channelFileUploadOpen = useSelector((state: RootState) => state.fileUpload.channelFileUpload);

    const channelFiles = useSelector((state: RootState) => state.channel.channelInputState[channelId] || {});

    const dispatch = useDispatch();
    const uploadFile = useUploadFile()

    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFile = React.useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (!files?.length) return

            await uploadFile.makeRequestToUploadToChannel(files, channelId)

            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the input
            }

            close()
        },
        [channelId, uploadFile]
    )

    useEffect(() => {

        if (channelFileUploadOpen.isOpen) {
            fileInputRef.current?.click()
            dispatch(closeChannelFileUpload())
        }

    }, [ channelFileUploadOpen]);

    const removeProjectPreviewFile = (key: string) => {
        dispatch(
            deleteChannelPreviewFiles({
                key,
                channelId
            })
        );
        dispatch(
            removeChannelUploadedFiles({
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

        dispatch(openMediaLightboxDialog({allMedia:  channelFiles.filesUploaded, media: attachmentMedia, mediaGetUrl: GetEndpointUrl.GetChannelMedia + '/' + channelId}))

    }

    return (
        <div className='flex flex-wrap'>
            {
                channelFiles.filePreview?.map((pfile)=>{
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