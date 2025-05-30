import {createSlice} from "@reduxjs/toolkit";
import {FilePreview} from "@/store/slice/channelSlice";
import {AttachmentMediaReq} from "@/types/attachment";


export interface ChatInputState {
    commentBody: string,
    filesUploaded: AttachmentMediaReq[],
    filesPreview: FilePreview[]
}

export interface ExtendedChatInputState {
    [key: string]:  ChatInputState;
}

interface AddPreviewFiles {
    filesUploaded: FilePreview
    chatUUID: string
}

interface RemoveUploadedFile {
    key: string,
    chatUUID: string
}

interface AddUploadedFiles {
    filesUploaded: AttachmentMediaReq
    chatUUID: string
}

interface UpdatePreviewFiles {
    key: string,
    progress: number,
    chatUUID: string
}

interface UpdatePreviewFilesUUID {
    chatUUID: string,
    key: string,
    uuid: string
}

interface ClearDocComment {
    chatUUID: string
}

interface createOrUpdateCommentBody {
    chatUUID: string
    body: string
}

const initialState = {
    chatInputState: {} as ExtendedChatInputState
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {

        createOrUpdateChatBody: (state, action: {payload: createOrUpdateCommentBody}) => {
            const { chatUUID, body } = action.payload;

            if (!state.chatInputState[chatUUID]) {
                state.chatInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.chatInputState[chatUUID].commentBody = body;
        },


        addChatPreviewFiles: (state, action: {payload: AddPreviewFiles}) => {
            const { filesUploaded, chatUUID} = action.payload;

            if(!state.chatInputState[chatUUID]) {
                state.chatInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.chatInputState[chatUUID].filesPreview.push(filesUploaded);
        },

        deleteChatPreviewFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, chatUUID } = action.payload;

            if(!state.chatInputState[chatUUID]) {
                state.chatInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.chatInputState[chatUUID].filesPreview = state.chatInputState[chatUUID].filesPreview.filter((media) => {
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

        updateChatPreviewFiles: (state, action: {payload: UpdatePreviewFiles}) => {
            const { key, progress, chatUUID } = action.payload;
            if(!state.chatInputState[chatUUID]) {
                state.chatInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.chatInputState[chatUUID].filesPreview = state.chatInputState[chatUUID].filesPreview.map((item) => {
                return item.key === key ? { ...item, progress } : item;
            });

        },

        updateChatPreviewFilesUUID: (state, action: {payload: UpdatePreviewFilesUUID}) => {
            const { chatUUID, key, uuid } = action.payload;
            if (state.chatInputState[chatUUID]) {
                state.chatInputState[chatUUID].filesPreview = state.chatInputState[chatUUID].filesPreview.map((item) => {
                    return item.key === key ? { ...item, uuid } : item;
                });
            }
        },


        addChatUploadedFiles: (state, action: {payload: AddUploadedFiles}) => {
            const { filesUploaded, chatUUID } = action.payload;
            if(!state.chatInputState[chatUUID]) {
                state.chatInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.chatInputState[chatUUID].filesUploaded.push(filesUploaded);
        },

        removeChatUploadedFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, chatUUID } = action.payload;
            if(!state.chatInputState[chatUUID]) {
                state.chatInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.chatInputState[chatUUID].filesUploaded = state.chatInputState[chatUUID].filesUploaded.filter((media) => media.attachment_obj_key !== key);
        },

        clearChatInputState: (state, action :{payload: ClearDocComment}) => {
            const {chatUUID } = action.payload;

            state.chatInputState[chatUUID] = { commentBody: '', filesUploaded: [] , filesPreview: [] };

        },

    }
});

export const {
    createOrUpdateChatBody,
    addChatPreviewFiles,
    deleteChatPreviewFiles,
    updateChatPreviewFiles,
    addChatUploadedFiles,
    removeChatUploadedFiles,
    clearChatInputState,
    updateChatPreviewFilesUUID
} = chatSlice.actions

export default chatSlice;