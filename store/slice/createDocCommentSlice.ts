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


export interface DocCommentInputState {
    commentBody: string,
    filesUploaded: FileUploaded[],
    filesPreview: FilePreview[]
}

export interface ExtendedDocCommentInputState {
    [key: string]:  DocCommentInputState;
}

interface AddPreviewFiles {
    fileUploaded: FilePreview
    docUUID: string
}

interface RemoveUploadedFile {
    key: number,
    docUUID: string
}

interface AddUploadedFiles {
    filesUploaded: FileUploaded
    docUUID: string
}

interface UpdatePreviewFiles {
    key: number,
    progress: number,
    docUUID: string
}

interface ClearDocComment {
    docUUID: string
}

interface createOrUpdateCommentBody {
   docUUID: string
    body: string
}

const initialState = {
    docCommentInputState: {} as ExtendedDocCommentInputState
}

export const createDocCommentSlice = createSlice({
    name: 'createDocComment',
    initialState,
    reducers: {

        createOrUpdateDocCommentBody: (state, action: {payload: createOrUpdateCommentBody}) => {
            const { docUUID, body } = action.payload;

            if (!state.docCommentInputState[docUUID]) {
                state.docCommentInputState[docUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.docCommentInputState[docUUID].commentBody = body;
        },


        addDocCommentPreviewFiles: (state, action: {payload: AddPreviewFiles}) => {
            const { fileUploaded, docUUID} = action.payload;

            if(!state.docCommentInputState[docUUID]) {
                state.docCommentInputState[docUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.docCommentInputState[docUUID].filesPreview.push(fileUploaded);
        },

        deleteDocCommentPreviewFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, docUUID } = action.payload;

            if(!state.docCommentInputState[docUUID]) {
                state.docCommentInputState[docUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.docCommentInputState[docUUID].filesPreview = state.docCommentInputState[docUUID].filesPreview.filter((media) => {
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

        updateDocCommentPreviewFiles: (state, action: {payload: UpdatePreviewFiles}) => {
            const { key, progress, docUUID } = action.payload;
            if(!state.docCommentInputState[docUUID]) {
                state.docCommentInputState[docUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.docCommentInputState[docUUID].filesPreview = state.docCommentInputState[docUUID].filesPreview.map((item) => {
                return item.key === key ? { ...item, progress } : item;
            });

        },


        addDocCommentUploadedFiles: (state, action: {payload: AddUploadedFiles}) => {
            const { filesUploaded, docUUID } = action.payload;
            if(!state.docCommentInputState[docUUID]) {
                state.docCommentInputState[docUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.docCommentInputState[docUUID].filesUploaded.push(filesUploaded);
        },

        removeDocCommentUploadedFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, docUUID } = action.payload;
            if(!state.docCommentInputState[docUUID]) {
                state.docCommentInputState[docUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.docCommentInputState[docUUID].filesUploaded = state.docCommentInputState[docUUID].filesUploaded.filter((media) => media.key !== key);
        },

        clearDocCommentInputState: (state, action :{payload: ClearDocComment}) => {
            const {docUUID } = action.payload;

            state.docCommentInputState[docUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };


        },

    }
});

export const {
    createOrUpdateDocCommentBody,
    addDocCommentPreviewFiles,
    addDocCommentUploadedFiles,
    updateDocCommentPreviewFiles,
    deleteDocCommentPreviewFiles,
    removeDocCommentUploadedFiles,
    clearDocCommentInputState

} =createDocCommentSlice.actions