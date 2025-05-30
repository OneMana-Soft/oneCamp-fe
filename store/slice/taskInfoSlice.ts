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


export interface TaskInfoInputState {
    filesUploaded: FileUploaded[],
    filesPreview: FilePreview[]
}

export interface ExtendedTaskInfoInputState {
    [key: string]:  TaskInfoInputState;
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

const initialState = {
    taskInfoInputState: {} as ExtendedTaskInfoInputState
}

export const taskInfoSlice = createSlice({
    name: 'TaskInfo',
    initialState,
    reducers: {


        addTaskInfoPreviewFiles: (state, action: {payload: AddPreviewFiles}) => {
            const { fileUploaded, taskUUID} = action.payload;

            if(!state.taskInfoInputState[taskUUID]) {
                state.taskInfoInputState[taskUUID] = {  filesUploaded: [] , filesPreview: [] };
            }

            state.taskInfoInputState[taskUUID].filesPreview.push(fileUploaded);
        },

        deleteTaskInfoPreviewFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, taskUUID } = action.payload;

            if(!state.taskInfoInputState[taskUUID]) {
                state.taskInfoInputState[taskUUID] = { filesUploaded: [] , filesPreview: [] };
            }

            state.taskInfoInputState[taskUUID].filesPreview = state.taskInfoInputState[taskUUID].filesPreview.filter((media) => {
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

        updateTaskInfoPreviewFiles: (state, action: {payload: UpdatePreviewFiles}) => {
            const { key, progress, taskUUID } = action.payload;
            if(!state.taskInfoInputState[taskUUID]) {
                state.taskInfoInputState[taskUUID] = { filesUploaded: [] , filesPreview: [] };
            }
            state.taskInfoInputState[taskUUID].filesPreview = state.taskInfoInputState[taskUUID].filesPreview.map((item) => {
                return item.key === key ? { ...item, progress } : item;
            });

        },


        addTaskInfoUploadedFiles: (state, action: {payload: AddUploadedFiles}) => {
            const { filesUploaded, taskUUID } = action.payload;
            if(!state.taskInfoInputState[taskUUID]) {
                state.taskInfoInputState[taskUUID] = { filesUploaded: [] , filesPreview: [] };
            }
            state.taskInfoInputState[taskUUID].filesUploaded.push(filesUploaded);
        },

        removeTaskInfoUploadedFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, taskUUID } = action.payload;
            if(!state.taskInfoInputState[taskUUID]) {
                state.taskInfoInputState[taskUUID] = { filesUploaded: [] , filesPreview: [] };
            }
            state.taskInfoInputState[taskUUID].filesUploaded = state.taskInfoInputState[taskUUID].filesUploaded.filter((media) => media.key !== key);
        },

        clearTaskInfoInputState: (state, action :{payload: ClearTaskComment}) => {
            const {taskUUID } = action.payload;

            state.taskInfoInputState[taskUUID] = { filesUploaded: [] , filesPreview: [] };


        },

    }
});

export const {
    addTaskInfoPreviewFiles,
    deleteTaskInfoPreviewFiles,
    updateTaskInfoPreviewFiles,
    addTaskInfoUploadedFiles,
    removeTaskInfoUploadedFiles,
    clearTaskInfoInputState

} =taskInfoSlice.actions