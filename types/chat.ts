import {UserProfileDataInterface} from "@/types/user";
import {GroupedReaction} from "@/types/reaction";
import {AttachmentMediaReq} from "@/types/attachment";
import {PostsRes} from "@/types/post";

export interface ChatInfo {
    uid: string
    chat_from: UserProfileDataInterface,
    chat_to: UserProfileDataInterface,
    chat_created_at: string,
    chat_updated_at: string,
    chat_deleted_at: string,
    chat_body_text: string,
    chat_reactions: GroupedReaction,
    chat_attachments: AttachmentMediaReq,
    chat_fwd_msg_post: PostsRes
    chat_fwd_msg_chat: ChatInfo
    chat_uuid: string
}

export interface ChatInfoRes {
    data: ChatInfo
    msg: string
}