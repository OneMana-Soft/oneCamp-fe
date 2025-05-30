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


export interface ChatCommentInputState {
    commentBody: string,
    filesUploaded: FileUploaded[],
    filesPreview: FilePreview[]
}

export interface ExtendedChatCommentInputState {
    [key: string]:  ChatCommentInputState;
}

interface AddPreviewFiles {
    fileUploaded: FilePreview
    chatUUID: string
}

interface RemoveUploadedFile {
    key: number,
    chatUUID: string
}

interface AddUploadedFiles {
    filesUploaded: FileUploaded
    chatUUID: string
}

interface UpdatePreviewFiles {
    key: number,
    progress: number,
    chatUUID: string
}

interface ClearChatComment {
    chatUUID: string
}

interface createOrUpdateCommentBody {
   chatUUID: string
    body: string
}

const initialState = {
    chatCommentInputState: {} as ExtendedChatCommentInputState
}

export const createChatCommentSlice = createSlice({
    name: 'createChatComment',
    initialState,
    reducers: {

        createOrUpdateChatCommentBody: (state, action: {payload: createOrUpdateCommentBody}) => {
            const { chatUUID, body } = action.payload;

            if (!state.chatCommentInputState[chatUUID]) {
                state.chatCommentInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.chatCommentInputState[chatUUID].commentBody = body;
        },


        addChatCommentPreviewFiles: (state, action: {payload: AddPreviewFiles}) => {
            const { fileUploaded, chatUUID} = action.payload;

            if(!state.chatCommentInputState[chatUUID]) {
                state.chatCommentInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.chatCommentInputState[chatUUID].filesPreview.push(fileUploaded);
        },

        deleteChatCommentPreviewFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, chatUUID } = action.payload;

            if(!state.chatCommentInputState[chatUUID]) {
                state.chatCommentInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.chatCommentInputState[chatUUID].filesPreview = state.chatCommentInputState[chatUUID].filesPreview.filter((media) => {
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

        updateChatCommentPreviewFiles: (state, action: {payload: UpdatePreviewFiles}) => {
            const { key, progress, chatUUID } = action.payload;
            if(!state.chatCommentInputState[chatUUID]) {
                state.chatCommentInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.chatCommentInputState[chatUUID].filesPreview = state.chatCommentInputState[chatUUID].filesPreview.map((item) => {
                return item.key === key ? { ...item, progress } : item;
            });

        },


        addChatCommentUploadedFiles: (state, action: {payload: AddUploadedFiles}) => {
            const { filesUploaded, chatUUID } = action.payload;
            if(!state.chatCommentInputState[chatUUID]) {
                state.chatCommentInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.chatCommentInputState[chatUUID].filesUploaded.push(filesUploaded);
        },

        removeChatCommentUploadedFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, chatUUID } = action.payload;
            if(!state.chatCommentInputState[chatUUID]) {
                state.chatCommentInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.chatCommentInputState[chatUUID].filesUploaded = state.chatCommentInputState[chatUUID].filesUploaded.filter((media) => media.key !== key);
        },

        clearChatCommentInputState: (state, action :{payload: ClearChatComment}) => {
            const {chatUUID } = action.payload;

            state.chatCommentInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };


        },

    }
});

export const {
    createOrUpdateChatCommentBody,
    addChatCommentPreviewFiles,
    addChatCommentUploadedFiles,
    updateChatCommentPreviewFiles,
    deleteChatCommentPreviewFiles,
    removeChatCommentUploadedFiles,
    clearChatCommentInputState

} =createChatCommentSlice.actions