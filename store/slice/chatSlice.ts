import {createSlice} from "@reduxjs/toolkit";
import {ExtendedScrollToBottom, FilePreview, ScrollToBottom} from "@/store/slice/channelSlice";
import {AttachmentMediaReq} from "@/types/attachment";
import {ChatInfo} from "@/types/chat";
import {UserProfileDataInterface} from "@/types/user";
import {GroupedReaction} from "@/types/reaction";
import {CommentInfoInterface} from "@/types/comment";
import {PostsRes} from "@/types/post";


export interface ChatInputState {
    chatBody: string,
    filesUploaded: AttachmentMediaReq[],
    filesPreview: FilePreview[]
}

interface CreateChat {
    chatId: string
    chatText: string
    chatCreatedAt: string
    chatBy: UserProfileDataInterface
    chatTo: UserProfileDataInterface
    dmId: string
    fwdPost?: PostsRes
    fwdChat?: ChatInfo
    attachments: AttachmentMediaReq[]
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

interface UpdateChatByChatId {
    messageId: string
    chatId: string
    htmlText: string
}

interface RemoveChat {
    dmId: string
    chatIndex: number
}

interface UpdateScrollToBottom {
    chatId: string
    scrollToBottom: boolean
}

interface RemoveChatByChatId {
    messageId: string
    chatId: string
}

interface RemoveChatReactionByChatId {
    messageId: string
    reactionId: string,
    chatId: string,
}

interface UpdatePostReactionByChatId {
    messageId: string
    reactionId: string,
    chatId: string,
    emojiId: string
}

interface CreateChatReactionByChatId {
    messageId: string
    reactionId: string,
    chatId: string,
    emojiId: string
    addedBy: UserProfileDataInterface
}

interface UpdateChat {
    dmId: string
    chatIndex: number
    htmlText: string
}

interface UpdateChats {
    chatId: string,
    chats: ChatInfo[]
}

interface UpdateChatCommentCount {
    chatId: string
    dmId: string
}

interface UpdateReplyCountInterface {
    chatId: string
    messageId: string
    comment: CommentInfoInterface
}

interface UserChatListInput {
    userList: UserProfileDataInterface[]
}

interface AddOrUpdateUserChatListInput {
    user: UserProfileDataInterface
}

export interface  ExtendedChats {
    [key: string]:  ChatInfo[];
}

const initialState = {
    chatInputState: {} as ExtendedChatInputState,
    chatMessages: {} as ExtendedChats,
    chatScrollToBottom: {} as ExtendedScrollToBottom,
    latestChatList: [] as UserProfileDataInterface[]

}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {

        createOrUpdateChatBody: (state, action: {payload: createOrUpdateCommentBody}) => {
            const { chatUUID, body } = action.payload;

            if (!state.chatInputState[chatUUID]) {
                state.chatInputState[chatUUID] = { chatBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.chatInputState[chatUUID].chatBody = body;
        },


        addChatPreviewFiles: (state, action: {payload: AddPreviewFiles}) => {
            const { filesUploaded, chatUUID} = action.payload;

            if(!state.chatInputState[chatUUID]) {
                state.chatInputState[chatUUID] = { chatBody: '', filesUploaded: [] , filesPreview: [] };
            }

            state.chatInputState[chatUUID].filesPreview.push(filesUploaded);
        },

        deleteChatPreviewFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, chatUUID } = action.payload;

            if(!state.chatInputState[chatUUID]) {
                state.chatInputState[chatUUID] = { chatBody: '', filesUploaded: [] , filesPreview: [] };
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
                state.chatInputState[chatUUID] = { chatBody: '', filesUploaded: [] , filesPreview: [] };
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
                state.chatInputState[chatUUID] = { chatBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.chatInputState[chatUUID].filesUploaded.push(filesUploaded);
        },

        removeChatUploadedFiles: (state, action: {payload: RemoveUploadedFile}) => {
            const { key, chatUUID } = action.payload;
            if(!state.chatInputState[chatUUID]) {
                state.chatInputState[chatUUID] = { chatBody: '', filesUploaded: [] , filesPreview: [] };
            }
            state.chatInputState[chatUUID].filesUploaded = state.chatInputState[chatUUID].filesUploaded.filter((media) => media.attachment_obj_key !== key);
        },

        clearChatInputState: (state, action :{payload: ClearDocComment}) => {
            const {chatUUID } = action.payload;

            state.chatInputState[chatUUID] = { chatBody: '', filesUploaded: [] , filesPreview: [] };

        },

        createChat: (state, action: {payload: CreateChat}) => {
            const {chatId, chatText, chatCreatedAt, dmId, chatBy, chatTo, attachments, fwdChat, fwdPost} = action.payload;
            if(!state.chatMessages[dmId]) {
                state.chatMessages[dmId] = [] as ChatInfo[]
            }
            state.chatMessages[dmId].push({
                chat_to: chatTo,
                chat_from: chatBy,
                chat_created_at: chatCreatedAt,
                chat_body_text: chatText,
                chat_uuid: chatId,
                chat_attachments: attachments,
                chat_comment_count: 0,
                chat_fwd_msg_chat: fwdChat,
                chat_fwd_msg_post: fwdPost,
            })
        },


        updateChatByChatId: (state, action: {payload: UpdateChatByChatId}) => {
            const { messageId, chatId, htmlText } = action.payload;
            state.chatMessages[chatId] = state.chatMessages[chatId].map((chat) => {
                if(messageId == chat.chat_uuid) {
                    chat.chat_body_text = htmlText
                }

                return chat
            })
        },

        removeChat: (state, action: {payload: RemoveChat}) => {
            const { dmId, chatIndex } = action.payload;
            if (chatIndex > -1 && chatIndex < state.chatMessages[dmId].length) {
                state.chatMessages[dmId].splice(chatIndex, 1);
            }
        },

        removeChatByChatId: (state, action: {payload: RemoveChatByChatId}) => {
            const { messageId, chatId } = action.payload;
            state.chatMessages[chatId] = state.chatMessages[chatId].filter((chat) => {
                return chat.chat_uuid !== messageId
            })
        },

        removeChatReactionByChatId: (state, action: {payload: RemoveChatReactionByChatId}) => {
            const { messageId, chatId, reactionId } = action.payload;
            state.chatMessages[chatId] = state.chatMessages[chatId].map((chat) => {

                if(chat.chat_uuid == messageId) {
                    chat.chat_reactions = chat.chat_reactions?.filter((reaction) => {
                        return reaction.uid !== reactionId
                    })
                }
                return chat
            })
        },

        decrementChatCommentCountByChatID: (state, action: {payload: UpdateChatCommentCount}) => {
            const {chatId , dmId} = action.payload;

            state.chatMessages[dmId].map((post)=> {
                if(post.chat_uuid == chatId) {
                    post.chat_comment_count--
                }
                return post
            })

        },

        updateChat: (state, action: {payload: UpdateChat}) => {
            const { dmId, chatIndex, htmlText } = action.payload;
            if (chatIndex > -1 && chatIndex < state.chatMessages[dmId].length) {
                state.chatMessages[dmId][chatIndex].chat_body_text = htmlText
            }

        },

        updateChats: (state, action: {payload: UpdateChats}) => {
            const { chatId, chats } = action.payload;

            state.chatMessages[chatId] = [...chats];

        },


        updateChatReactionByChatId: (state, action: {payload: UpdatePostReactionByChatId}) => {
            const { messageId, chatId, emojiId, reactionId } = action.payload;

            state.chatMessages[chatId] = state.chatMessages[chatId].map((chat) => {
                if(chat.chat_uuid == messageId) {
                    chat.chat_reactions = chat.chat_reactions?.map((reaction) => {
                        if (reaction.uid == reactionId) {
                            reaction.reaction_emoji_id = emojiId
                        }
                        return reaction
                    })
                }

                return chat
            })

        },

        createChatReactionChatId: (state, action: {payload: CreateChatReactionByChatId}) => {
            const { messageId, chatId, emojiId, reactionId , addedBy} = action.payload;

            state.chatMessages[chatId] = state.chatMessages[chatId].map((chat) => {
                if(chat.chat_uuid == messageId) {
                    if(!chat.chat_reactions) {
                        chat.chat_reactions = [] as GroupedReaction[]
                    }
                    chat.chat_reactions.push({
                        reaction_emoji_id: emojiId,
                        uid: reactionId,
                        reaction_added_by: addedBy
                    })
                }

                return chat
            })

        },

        updateChatScrollToBottom: (state, action: {payload: UpdateScrollToBottom}) => {

            const {chatId, scrollToBottom} = action.payload;

            if(!state.chatScrollToBottom[chatId]) {
                state.chatScrollToBottom[chatId] = {} as ScrollToBottom
            }

            state.chatScrollToBottom[chatId].shouldScrollToBottom = scrollToBottom

        },

        CreateUserChatList: (state, action: {payload: UserChatListInput}) => {

            const {userList} = action.payload;

            state.latestChatList = userList
        },

        CreateOrUpdateUserInChatList: (state, action: {payload: AddOrUpdateUserChatListInput}) => {
            const {user} = action.payload;

            let foundUser = false

            state.latestChatList = state.latestChatList.map((u) => {
                if(u.user_uuid == user.user_uuid) {
                   u.user_dms = user.user_dms
                    foundUser = true
                }

                return u
            })

            if(!foundUser) {
                state.latestChatList.push(user)
            }

        },

        AddUserInChatList: (state, action: {payload: AddOrUpdateUserChatListInput}) => {
            const {user} = action.payload;

            let foundUser = false

            state.latestChatList.forEach((u) => {
                if(u.user_uuid == user.user_uuid) {
                    foundUser = true
                    return
                }

            })

            if(!foundUser) {
                state.latestChatList.push(user)
            }

        },


        updateChatMessageReplyIncrement: (state, action: {payload: UpdateReplyCountInterface}) => {

            const {chatId, messageId, comment} = action.payload;

            state.chatMessages[chatId] = state.chatMessages[chatId].map((chat) => {

                if(chat.chat_uuid === messageId) {
                    chat.chat_comments = chat.chat_comments || [];
                    chat.chat_comments.push(comment);
                    chat.chat_comment_count++
                }

                return chat
            })
        },

        updateChatMessageReplyDecrement: (state, action: {payload: UpdateReplyCountInterface}) => {

            const {chatId, messageId, comment} = action.payload;

            state.chatMessages[chatId] = state.chatMessages[chatId].map((chat) => {

                if(chat.chat_uuid === messageId) {
                    chat.chat_comments = chat.chat_comments || [];
                    chat.chat_comments = chat.chat_comments.filter((c) => c.comment_uuid != comment.comment_uuid)
                    chat.chat_comment_count--
                }

                return chat
            })
        }



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
    updateChatByChatId,
    removeChat,
    updateChat,
    updateChats,
    removeChatByChatId,
    createChat,
    removeChatReactionByChatId,
    updateChatPreviewFilesUUID,

    decrementChatCommentCountByChatID,
    updateChatReactionByChatId,
    createChatReactionChatId,
    updateChatScrollToBottom,
    CreateUserChatList,
    CreateOrUpdateUserInChatList,
    AddUserInChatList,
    updateChatMessageReplyIncrement,
    updateChatMessageReplyDecrement
} = chatSlice.actions

export default chatSlice;