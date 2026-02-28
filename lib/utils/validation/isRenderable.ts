import {AttachmentMediaReq} from "@/types/attachment";

export function isRenderable(attachment: AttachmentMediaReq) {
    return attachment.attachment_type == 'image' || attachment.attachment_type == 'video';
}
