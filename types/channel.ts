import {UserProfileDataInterface} from "@/types/user";
import {AttachmentMediaReq} from "@/types/attachment";
import {PostsRes} from "@/types/post";

export interface ChannelInfoInterface {
    ch_uuid: string,
    ch_name: string,
    ch_icon: string,
    ch_private: boolean,
    ch_is_user_fav: boolean,
    ch_about: string,
    unread_post_count : number
    ch_created_at: string
    ch_is_admin? : boolean
    ch_is_member?: boolean
    ch_posts: PostsRes[]
    ch_created_by: UserProfileDataInterface,
    ch_handle: string,
    ch_member_count: number,
    ch_members ?: UserProfileDataInterface[],
    ch_moderators ?: UserProfileDataInterface[],
    ch_deleted_at ?: string
    notification_type ?: string

}

export interface ChannelInfoInterfaceResp {
    channel_info: ChannelInfoInterface,
    msg: string,
}

export interface ChannelInfoListInterfaceResp {
    channels_list: ChannelInfoInterface[],
    msg: string,
}

export interface ChannelNameExistsInterface {
    exists: boolean;
}

export interface ChannelNotificationInterface {
    notification_type: string,
    channel_id: string
}

export interface ChannelJoinInterface {
    channel_id: string
}

export enum NotificationType {
    NotificationAll = "all",
    NotificationMention = "mention",
    NotificationBlock = "block",
}

export interface ChannelMemberUpdateInterface {
    channel_id: string,
    user_id: string
}



