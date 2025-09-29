import {AttachmentType} from "@/types/attachment";


export const ATTACHMENT_TYPE_IMAGE = 'image'
export const ATTACHMENT_TYPE_DOC = 'document'
export const ATTACHMENT_TYPE_AUDIO = 'audio'
export const ATTACHMENT_TYPE_VIDEO = 'video'
export const ATTACHMENT_TYPE_OTHER = 'other'


export const getAttachmentType = (fileName: string): AttachmentType => {

    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            return ATTACHMENT_TYPE_IMAGE
        case 'pdf':
        case 'txt':
            return ATTACHMENT_TYPE_DOC
        case 'mp3':
            return ATTACHMENT_TYPE_AUDIO
        case 'mp4':
        case 'mov':
        case 'webm':
        case 'webp':
            return ATTACHMENT_TYPE_VIDEO
        default:
            return ATTACHMENT_TYPE_OTHER
    }
}

