import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { prioritiesInterface } from "@/types/table"
import type { AttachmentMediaReq } from "@/types/attachment"
import type { TaskInfoInterface } from "@/types/task"

interface TaskData {
    taskUUID: string
    label: string
    name: string
    description: string
    status: prioritiesInterface | undefined
    priority: prioritiesInterface | undefined
    dueDate: Date | undefined
    startDate: Date | undefined
    isDeleted: boolean
    subTasks: TaskInfoInterface[]
    attachments: AttachmentMediaReq[]
}


const initialState = {
    taskData: {} as TaskData
}

const currentTaskDataSlice = createSlice({
    name: "currentTaskData",
    initialState,
    reducers: {
        initializeTaskData: (
            state,
            action: PayloadAction<{
                data: Partial<TaskData>
            }>,
        ) => {
            const { data } = action.payload
            state.taskData = {
                taskUUID: data.taskUUID ?? '',
                label: data.label ?? "",
                name: data.name ?? "",
                description: data.description ?? "",
                status: data.status,
                priority: data.priority,
                dueDate: data.dueDate,
                startDate: data.startDate,
                isDeleted: data.isDeleted ?? false,
                subTasks: data.subTasks ?? [],
                attachments: data.attachments ?? [],
            }
        },

        updateTaskLabel: (state, action: PayloadAction<{ value: string }>) => {
            const { value } = action.payload
            if (state.taskData) state.taskData.label = value
        },

        updateTaskName: (state, action: PayloadAction<{  value: string }>) => {
            const { value } = action.payload
            if (state.taskData) state.taskData.name = value
        },

        updateTaskDescription: (state, action: PayloadAction<{ value: string }>) => {
            const {value } = action.payload
            if (state.taskData) state.taskData.description = value
        },

        updateTaskStatus: (state, action: PayloadAction<{ value: prioritiesInterface | undefined }>) => {
            const {  value } = action.payload
            if (state.taskData) state.taskData.status = value
        },

        updateTaskPriority: (
            state,
            action: PayloadAction<{ value: prioritiesInterface | undefined }>,
        ) => {
            const {  value } = action.payload
            if (state.taskData) state.taskData.priority = value
        },

        updateTaskDueDate: (state, action: PayloadAction<{ value: Date | undefined }>) => {
            const { value } = action.payload
            if (state.taskData) state.taskData.dueDate = value
        },

        updateTaskStartDate: (state, action: PayloadAction<{ value: Date | undefined }>) => {
            const { value } = action.payload
            if (state.taskData) state.taskData.startDate = value
        },

        updateTaskIsDeleted: (state, action: PayloadAction<{ value: boolean }>) => {
            const { value } = action.payload
            if (state.taskData) state.taskData.isDeleted = value
        },

        updateTaskSubTasks: (state, action: PayloadAction<{ value: TaskInfoInterface[] }>) => {
            const {  value } = action.payload
            if (state.taskData) state.taskData.subTasks = value
        },

        addSubTask: (state, action: PayloadAction<{  subTask: TaskInfoInterface }>) => {
            const {  subTask } = action.payload
            if (state.taskData) state.taskData.subTasks.push(subTask)
        },

        updateTaskAttachments: (state, action: PayloadAction<{ value: AttachmentMediaReq[] }>) => {
            const { value } = action.payload
            if (state.taskData) state.taskData.attachments = value
        },

        addAttachment: (state, action: PayloadAction<{  attachment: AttachmentMediaReq }>) => {
            const { attachment } = action.payload
            if (state.taskData) state.taskData.attachments.push(attachment)
        },

        removeAttachment: (state, action: PayloadAction<{ attachmentUUID: string }>) => {
            const { attachmentUUID } = action.payload
            if (state.taskData) {
                state.taskData.attachments = state.taskData.attachments.filter((a) => a.attachment_uuid !== attachmentUUID)
            }
        },

        clearTaskData: (state) => {
            state.taskData = initialState.taskData
        },
    },
})

export const {
    initializeTaskData,
    updateTaskLabel,
    updateTaskName,
    updateTaskDescription,
    updateTaskStatus,
    updateTaskPriority,
    updateTaskDueDate,
    updateTaskStartDate,
    updateTaskIsDeleted,
    updateTaskSubTasks,
    addSubTask,
    updateTaskAttachments,
    addAttachment,
    removeAttachment,
    clearTaskData,
} = currentTaskDataSlice.actions

export default currentTaskDataSlice
