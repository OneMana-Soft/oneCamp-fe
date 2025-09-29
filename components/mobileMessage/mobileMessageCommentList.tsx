"use client"

import {CommentInfoInterface} from "@/types/comment";
import {MobileMessage} from "@/components/mobileMessage/mobileMessage";
import {UserProfileDataInterface, UserProfileInterface} from "@/types/user";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {GetEndpointUrl} from "@/services/endPoints";

interface CommentsListProps {
    comments: CommentInfoInterface[]
    addReaction: (emojiId:string, reactionId: string, commentId: string, idx: number) => void
    removeReaction: (reactionId: string, commentId: string, idx:number) => void
    updateMessage: (id: string, body: string, idx:number) => void;
    deleteMessage: (id: string, idx:number) => void;
    getMediaURL: string
    postUUID?: string
    chatUUID?: string
    chatMessageUUID?: string
    channelUUID?: string
    isAdmin?: boolean

}

export const MobileMessageCommentList = ({ updateMessage, isAdmin, deleteMessage, postUUID, channelUUID, chatUUID, chatMessageUUID, removeReaction, comments, getMediaURL, addReaction }: CommentsListProps) => {

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    if (!comments || comments.length === 0) {
        return null
    }



    return (
        <div className="">
            {comments?.map((comment, idx) => (
                <MobileMessage
                    key={comment.comment_uuid}
                    userInfo={comment?.comment_by || {} as UserProfileDataInterface}
                    createdAt={comment?.comment_created_at || ''}
                    content={comment.comment_text}
                    attachments={comment.comment_attachments}
                    addReaction={(emojiId:string, reactionId: string)=>{addReaction(emojiId, reactionId, comment.comment_uuid, idx)}}
                    removeReaction={(reactionId: string)=>{removeReaction(reactionId, comment.comment_uuid, idx)}}
                    updateMessage={(id: string, body: string)=>{updateMessage(id, body, idx)}}
                    deleteMessage={(id: string)=>{deleteMessage(id, idx)}}
                    getMediaUrl={getMediaURL}
                    commentUUID={comment.comment_uuid}
                    chatUUID={chatUUID}
                    chatMessageUUID={chatMessageUUID}
                    channelUUID={channelUUID}
                    postUUID={postUUID}
                    rawReactions={comment.comment_reactions}
                    isAdmin={isAdmin}
                />
            ))}
        </div>
    )
}
