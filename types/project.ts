import {UserProfileDataInterface} from "@/types/user";
import {TaskInfoInterface} from "@/types/task";
import {AttachmentMediaReq} from "@/types/attachment";
import {TeamInfoInterface} from "@/types/team";

export interface ProjectInfoInterface {
    uid: string;
    project_uuid: string;
    project_name: string;
    project_status: string;
    project_team: TeamInfoInterface;
    project_tasks: TaskInfoInterface[];
    project_attachments: AttachmentMediaReq[];
    project_task_count: number;
    project_is_admin: boolean;
    project_is_member: boolean;
    project_members: UserProfileDataInterface[];
    project_admins: UserProfileDataInterface[];
    project_created_by: UserProfileDataInterface;
    project_created_at: string;
    project_updated_at: string;
    project_deleted_at: string;
}

export interface ProjectInfoRawInterface {
    msg: string;
    pageCount?: number;
    data: ProjectInfoInterface;
}

export interface ProjectInfoListRawInterface {
    msg: string;
    data: ProjectInfoInterface[];
}