import {UserProfileDataInterface} from "@/types/user";
import {AttachmentMediaReq} from "@/types/attachment";
import { GroupedReaction} from "@/types/reaction";


export interface CommentInfoInterface {
    comment_uuid: string
    comment_html_text: string
    comment_attachments: AttachmentMediaReq[]
    comment_reactions?: GroupedReaction[]
    comment_created_by: UserProfileDataInterface
    comment_added_locally: boolean
    comment_updated_at: string
    comment_created_at: string
}
