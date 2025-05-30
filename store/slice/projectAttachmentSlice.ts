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


export interface ProjectAttachmentInputState {
    filesUploaded: FileUploaded[],
    filesPreview: FilePreview[]
}

export interface ExtendedProjectAttachmentInputState {
    [key: string]:  ProjectAttachmentInputState;
}

interface AddPreviewFiles {
    fileUploaded: FilePreview
    projectUUID: string
}

interface RemoveUploadedFile {
    key: number,
    projectUUID: string
}

interface AddUploadedFiles {
    filesUploaded: FileUploaded
    projectUUID: string
}

interface UpdatePreviewFiles {
    key: number,
    progress: number,
    projectUUID: string
}

interface ClearTaskComment {
    projectUUID: string
}

const initialState = {
    projectAttachmentInputState: {} as ExtendedProjectAttachmentInputState
}

export const projectAttachmentSlice = createSlice({
    name: 'projectAttachment',
    initialState,
    reducers: {


        addProjectAttachmentPreviewFiles: (state, action: {payload: AddPreviewFiles}) => {
            const { fileUploaded, projectUUID} = action.payload;

            if(!state.projectAttachmentInputState[projectUUID]) {
                state.projectAttachmentInputState[projectUUID] = {  filesUploaded: [] , filesPreview: [] };
            }

            state.projectAttachmentInputState[projectUUID].filesPreview.push(fileUploaded);
        },

        deleteProjectAttachmentPreviewFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, projectUUID } = action.payload;

            if(!state.projectAttachmentInputState[projectUUID]) {
                state.projectAttachmentInputState[projectUUID] = { filesUploaded: [] , filesPreview: [] };
            }

            state.projectAttachmentInputState[projectUUID].filesPreview = state.projectAttachmentInputState[projectUUID].filesPreview.filter((media) => {
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

        updateProjectAttachmentPreviewFiles: (state, action: {payload: UpdatePreviewFiles}) => {
            const { key, progress, projectUUID } = action.payload;
            if(!state.projectAttachmentInputState[projectUUID]) {
                state.projectAttachmentInputState[projectUUID] = { filesUploaded: [] , filesPreview: [] };
            }
            state.projectAttachmentInputState[projectUUID].filesPreview = state.projectAttachmentInputState[projectUUID].filesPreview.map((item) => {
                return item.key === key ? { ...item, progress } : item;
            });

        },


        addProjectAttachmentUploadedFiles: (state, action: {payload: AddUploadedFiles}) => {
            const { filesUploaded, projectUUID } = action.payload;
            if(!state.projectAttachmentInputState[projectUUID]) {
                state.projectAttachmentInputState[projectUUID] = { filesUploaded: [] , filesPreview: [] };
            }
            state.projectAttachmentInputState[projectUUID].filesUploaded.push(filesUploaded);
        },

        removeProjectAttachmentUploadedFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, projectUUID } = action.payload;
            if(!state.projectAttachmentInputState[projectUUID]) {
                state.projectAttachmentInputState[projectUUID] = { filesUploaded: [] , filesPreview: [] };
            }
            state.projectAttachmentInputState[projectUUID].filesUploaded = state.projectAttachmentInputState[projectUUID].filesUploaded.filter((media) => media.key !== key);
        },

        clearProjectAttachmentInputState: (state, action :{payload: ClearTaskComment}) => {
            const {projectUUID } = action.payload;

            state.projectAttachmentInputState[projectUUID] = { filesUploaded: [] , filesPreview: [] };


        },

    }
});

export const {
    addProjectAttachmentPreviewFiles,
    deleteProjectAttachmentPreviewFiles,
    updateProjectAttachmentPreviewFiles,
    addProjectAttachmentUploadedFiles,
    removeProjectAttachmentUploadedFiles,
    clearProjectAttachmentInputState

} =projectAttachmentSlice.actions