import {UserProfileDataInterface} from "@/types/user";
import {ProjectInfoInterface} from "@/types/project";
import {AttachmentMediaReq} from "@/types/attachment";
import {TeamInfoInterface} from "@/types/team";
import {CommentInfoInterface} from "@/types/comment";

export interface TaskInfoInterface {
    uid: string;
    id: string;
    task_uuid: string;
    task_name: string;
    task_priority: string;
    task_project: ProjectInfoInterface
    task_team: TeamInfoInterface
    task_status: string;
    task_sub_tasks: TaskInfoInterface[]
    task_parent_task: TaskInfoInterface
    task_label: string;
    task_deleted_at: string;
    task_comments: CommentInfoInterface[]
    task_description: string;
    task_activities: TaskActivityInterface[]
    task_assignee: UserProfileDataInterface;
    task_collaborators: UserProfileDataInterface[];
    task_due_date: string;
    task_sub_task_count: number
    task_comment_count: number
    task_start_date: string;
    task_attachments: AttachmentMediaReq[]
    task_created_by: UserProfileDataInterface;
}
export interface TaskInfoRawInterface {
    data: TaskInfoInterface;
    msg: string;
}

export interface TaskActivityInterface {
    activity_uuid?: string;
    activity_by: UserProfileDataInterface
    activity_type: string
    activity_time: string
    activity_prev_state: string
    activity_next_state: string

}


export const taskPriorityOptions = [
    { id: "high", label: "High" },
    { id: "medium", label: "Medium" },
    { id: "low", label: "Low" },
]

export const taskStatusOptions = [
    { id: "backlog", label: "Backlog" },
    { id: "todo", label: "To Do" },
    { id: "inProgress", label: "In Progress" },
    { id: "done", label: "Done" },
    { id: "canceled", label: "Canceled" },
]
