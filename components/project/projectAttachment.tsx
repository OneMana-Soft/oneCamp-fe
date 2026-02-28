import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {ChevronDown,} from "lucide-react"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu"

import {downloadFile} from "@/lib/utils/file/downloadFile";
import {FileTypeIcon} from "@/components/fileIcon/fileTypeIcon";
import {GetEndpointUrl} from "@/services/endPoints";
import {AttachmentIcon} from "@/components/attachments/attachmentIcon";
import {AttachmentMediaReq} from "@/types/attachment";
import {useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";

interface ProjectAttachmentProps {
    attachmentInfo: AttachmentMediaReq,
    isAdmin: boolean
    handleRemoveAttachment: (id: string) => void
    handleAttachmentIconCLick: () => void
    projectUUID: string
}

export default function ProjectAttachment({ attachmentInfo,  handleAttachmentIconCLick, projectUUID, handleRemoveAttachment, isAdmin}: ProjectAttachmentProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Track dropdown state


    const mediaInfo =useMediaFetch<GetMediaURLRes>(attachmentInfo.attachment_obj_key ? GetEndpointUrl.GetProjectMedia + '/' + projectUUID + '/' + attachmentInfo.attachment_uuid : '')


    const handleDownload = () => {
        if (mediaInfo.data?.url) {
            downloadFile(mediaInfo.data?.url, attachmentInfo.attachment_file_name)
        }
    }



    return (
        <div
            className='flex group relative justify-center items-center m-1 mt-2 p-1 rounded-xl border-2'
        >
            <div>
                <AttachmentIcon
                    attachmentType={attachmentInfo.attachment_type}
                    attachmentOnCLick={handleAttachmentIconCLick}
                    getUrl={GetEndpointUrl.GetProjectMedia + '/' + projectUUID + '/' + attachmentInfo.attachment_uuid}
                    fileName={attachmentInfo.attachment_file_name}
                />
            </div>
            <div className="flex-col">
                <div className="text-ellipsis truncate max-w-40 text-xs ">
                    {attachmentInfo.attachment_file_name}
                </div>
                <a href={mediaInfo.data?.url || ''} download={attachmentInfo.attachment_file_name} target='_blank' className='text-xs hover:underline text-muted-foreground'>
                    {('download')}
                </a>

            </div>

            <div>
                {isAdmin && <DropdownMenu
                    open={isDropdownOpen}
                    onOpenChange={(open) => setIsDropdownOpen(open)}
                >
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            className={'!p-0 !h-6 !w-6 md:invisible group-hover:visible ' + (isDropdownOpen?'visible':'')}
                        >
                            <ChevronDown className='h-5 w-5 text-muted-foreground'/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-fit">
                        <DropdownMenuItem className='hover:cursor-pointer'
                                          onClick={handleDownload}>
                            <span>{('download')}</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem className='hover:cursor-pointer' onClick={()=>{handleRemoveAttachment(attachmentInfo.attachment_uuid||'')}}>
                            <span>{('delete')}</span>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>}
            </div>
        </div>
    )
}
