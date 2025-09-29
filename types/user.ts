import {TaskInfoInterface} from "@/types/task";
import {TeamInfoInterface} from "@/types/team";
import {ProjectInfoInterface} from "@/types/project";
import {ChannelInfoInterface} from "@/types/channel";
import {AttachmentMediaReq} from "@/types/attachment";
import {ChatInfo} from "@/types/chat";

export interface UserProfileDataInterface {
    uid?: string;
    user_uuid: string;
    user_email_id?: string;
    user_name: string;
    user_tasks?: TaskInfoInterface[];
    user_channels?: ChannelInfoInterface[];
    user_task_count?: number;
    user_teams?: TeamInfoInterface[];
    user_projects?: ProjectInfoInterface[];
    user_overdue_task_count?: string;
    user_app_lang?: string;
    user_profile_object_key: string;
    user_is_admin?: boolean;
    user_team_name?: string;
    user_job_title?: string;
    user_about_me?: string;
    user_deleted_at?: string;
    user_notifications_paused?: boolean
    user_notification_pause_expires_at?: string | null
    user_status?: string
    user_device_connected?: number
    notification_type ?: string
    user_emoji_statuses?:UserEmojiStatus[]
    user_custom_notification?: NotificationSchedule
    user_dms?: UserDMInterface[]
}

export interface UserDMSearchTextInterface {
    search_text: string
}

export interface GenericSearchTextInterface {
    search_text: string
}

export enum UserStatus {
    online = "online",
    offline = "offline",
}

export const USER_STATUS_ONLINE = "online"
export const USER_STATUS_OFFLINE = "offline"

export interface UserDMInterface {
    dm_grouping_id: string
    dm_chats: ChatInfo[]
    dm_unread: number
}
export interface UserProfileInterface {
    data: UserProfileDataInterface;
    mag: string;
}

export type StatusTime = '30m' | '1h' | '4h' | 'today' | 'this_week' | 'custom';

export type CustomNotificationSchedule = {
    days: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[]
    start_time: string
    end_time: string
}

export type NotificationSchedule = {
    type: 'none' | 'custom'
    custom: CustomNotificationSchedule | null
}

export interface UserStatusRespInterface {
    data: UserEmojiStatus[]
}

export interface UserListInterfaceResp {
    users: UserProfileDataInterface[],
    msg: string
}

export interface ChannelAndUserListInterfaceResp {
    type: string
    user_uuid: string
    user_dgraph_uuid: string
    user_profile_object_key: string
    user_name: string
    channel_uuid: string
    channel_dgraph_uid: string
    channel_name: string
}

export interface MessageFwdReq {
    fwd_text: string
    fwd_chat_uuid: string
    fwd_post_uuid: string
    fwd_channel_uuid: string
    fwd_attachments: AttachmentMediaReq[]
    fwd_list: ChannelAndUserListInterfaceResp[]
}

export interface ChannelAndUserListInterfaceReq {
    search_text: string
}

export interface UserEmojiStatus {
    status_user_emoji_id: string
    status_user_emoji_desc: string
    status_user_emoji_expiry_at?: string
    status_user_emoji_expiry_in?: StatusTime
}

export interface UserEmojiStatusResp {
    data: UserEmojiStatus
    msg: string
}

export interface UserSelectedOptionInterface {
    reactionId: string,
    emojiId: string
}


export interface UpdateUserEmojiStatusReq {
    emoji_id: string
    emoji_status_desc: string
    emoji_expiry_time_at: string
    emoji_expiry_time_in: string
    emoji_timezone: string
}

export const chat_forward_type = "chat"
export const channel_forward_type = "channel"

