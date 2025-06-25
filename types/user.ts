import {TaskInfoInterface} from "@/types/task";
import {TeamInfoInterface} from "@/types/team";
import {ProjectInfoInterface} from "@/types/project";
import {ChannelInfoInterface} from "@/types/channel";
import {AttachmentMediaReq} from "@/types/attachment";

export interface UserProfileDataInterface {
    uid: string;
    user_uuid: string;
    user_email_id: string;
    user_name: string;
    user_tasks: TaskInfoInterface[];
    user_channels: ChannelInfoInterface[];
    user_task_count: number;
    user_teams: TeamInfoInterface[];
    user_projects: ProjectInfoInterface[];
    user_overdue_task_count: string;
    user_app_lang: string;
    user_profile_object_key: string;
    user_is_admin: boolean;
    user_team_name: string;
    user_job_title: string;
    user_about_me: string;
    user_deleted_at: string;
    user_notifications_paused: boolean
    user_notification_pause_expires_at: string | null
    user_status: UserStatusInterface | null
    user_custom_notification: NotificationSchedule
}
export interface UserProfileInterface {
    data: UserProfileDataInterface;
    pageCount?: number;
    mag: string;
}

export type StatusTime = '30m' | '1h' | '4h' | 'today' | 'this_week' | 'custom';

export interface UserStatusInterface {
    message: string
    emoji: string
    expiration_setting: StatusTime
    expires_at: string | null
    pause_notifications: boolean
    expires_in: StatusTime
}

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
    data: UserStatusInterface[]
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

