import {AttachmentType} from "@/types/attachment";

export const getAttachmentType = (fileName: string): AttachmentType => {

    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            return 'image'
        case 'pdf':
        case 'txt':
            return 'document'
        case 'mp3':
            return 'audio'
        case 'mp4':
        case 'mov':
        case 'webm':
        case 'webp':
            return 'video'
        default:
            return 'other'
    }
}