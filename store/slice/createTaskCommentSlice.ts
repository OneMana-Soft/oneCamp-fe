import {CancelTokenSource} from "axios";
import {createSlice} from "@reduxjs/toolkit";

export interface FileUploaded {
    key: number,
    fileName: string,
    url: string,
}

export interface FilePreview {
    key: number,
    fileName: string,
    progress: number,
    cancelSource: CancelTokenSource
}


export interface TaskCommentInputState {
    commentBody: string,
    filesUploaded: FileUploaded[],
    filesPreview: FilePreview[]
}

export interface ExtendedTaskCommentInputState {
    [key: string]:  TaskCommentInputState;
}

interface AddPreviewFiles {
    fileUploaded: FilePreview
    taskUUID: string
}

interface RemoveUploadedFile {
    key: number,
    taskUUID: string
}

interface AddUploadedFiles {
    filesUploaded: FileUploaded
    taskUUID: string
}

interface UpdatePreviewFiles {
    key: number,
    progress: number,
    taskUUID: string
}

interface ClearTaskComment {
    taskUUID: string
}

interface createOrUpdateCommentBody {
   taskUUID: string
    body: string
}

const initialState = {
    taskCommentInputState: {} as ExtendedTaskCommentInputState
}

export const createTaskCommentSlice = createSlice({
    name: 'createTaskComment',
    initialState,
    reducers: {

        createOrUpdateTaskCommentBody: (state, action: {payload: createOrUpdateCommentBody}) => {
            const { taskUUID, body } = action.payload;

            if (!state.taskCommentInputState[taskUUID]) {
                state.taskCommentInputState[taskUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.taskCommentInputState[taskUUID].commentBody = body;
        },


        addTaskCommentPreviewFiles: (state, action: {payload: AddPreviewFiles}) => {
            const { fileUploaded, taskUUID} = action.payload;

            if(!state.taskCommentInputState[taskUUID]) {
                state.taskCommentInputState[taskUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.taskCommentInputState[taskUUID].filesPreview.push(fileUploaded);
        },

        deleteTaskCommentPreviewFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, taskUUID } = action.payload;

            if(!state.taskCommentInputState[taskUUID]) {
                state.taskCommentInputState[taskUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.taskCommentInputState[taskUUID].filesPreview = state.taskCommentInputState[taskUUID].filesPreview.filter((media) => {
                if (media.key === key) {
                    if(media.progress != 100 && typeof media.cancelSource.cancel === 'function') {
                        media.cancelSource.cancel(`Stopping file upload: ${media.fileName}`);
                    }
                    return false;
                } else {
                    return true;
                }
            });

        },

        updateTaskCommentPreviewFiles: (state, action: {payload: UpdatePreviewFiles}) => {
            const { key, progress, taskUUID } = action.payload;
            if(!state.taskCommentInputState[taskUUID]) {
                state.taskCommentInputState[taskUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.taskCommentInputState[taskUUID].filesPreview = state.taskCommentInputState[taskUUID].filesPreview.map((item) => {
                return item.key === key ? { ...item, progress } : item;
            });

        },


        addTaskCommentUploadedFiles: (state, action: {payload: AddUploadedFiles}) => {
            const { filesUploaded, taskUUID } = action.payload;
            if(!state.taskCommentInputState[taskUUID]) {
                state.taskCommentInputState[taskUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.taskCommentInputState[taskUUID].filesUploaded.push(filesUploaded);
        },

        removeTaskCommentUploadedFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, taskUUID } = action.payload;
            if(!state.taskCommentInputState[taskUUID]) {
                state.taskCommentInputState[taskUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.taskCommentInputState[taskUUID].filesUploaded = state.taskCommentInputState[taskUUID].filesUploaded.filter((media) => media.key !== key);
        },

        clearTaskCommentInputState: (state, action :{payload: ClearTaskComment}) => {
            const {taskUUID } = action.payload;

            state.taskCommentInputState[taskUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };


        },

    }
});

export const {
    createOrUpdateTaskCommentBody,
    addTaskCommentPreviewFiles,
    addTaskCommentUploadedFiles,
    updateTaskCommentPreviewFiles,
    deleteTaskCommentPreviewFiles,
    removeTaskCommentUploadedFiles,
    clearTaskCommentInputState

} =createTaskCommentSlice.actions