import {UserProfileDataInterface} from "@/types/user";
import {AttachmentMediaReq} from "@/types/attachment";
import { GroupedReaction} from "@/types/reaction";


export interface CommentInfoInterface {
    comment_uuid: string
    comment_text: string
    comment_attachments?: AttachmentMediaReq[]
    comment_reactions?: GroupedReaction[]
    comment_by?: UserProfileDataInterface
    comment_added_locally?: boolean
    comment_updated_at?: string
    comment_created_at?: string
}

export interface CreateUpdateCommentReqInterface {
    comment_attachments?: AttachmentMediaReq[]
    comment_text_html?: string
    post_id?: string
    chat_id?: string
    comment_id?: string
}

export interface CreateCommentResInterface {
    comment_created_at: string
    comment_id: string
}

