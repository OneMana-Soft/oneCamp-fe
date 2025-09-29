import { MessageContent } from "./messageContent"
import {CommentInfoInterface} from "@/types/comment";


interface CommentsListProps {
    comments: CommentInfoInterface[],
    removeReaction: (reactionId: string, commentId:string, idx:number) => void
    addOrUpdateReaction: (emojiId:string, reactionId: string, commentUUID:string, idx:number) => void
    removeComment: (id:string, idx: number) => void
    updateComment: (id:string, body: string, idx:number) => void
    getMediaURL: string
}

export const CommentsList = ({ comments, addOrUpdateReaction, removeReaction, removeComment, updateComment, getMediaURL }: CommentsListProps) => {
    if (!comments || comments.length === 0) {
        return null
    }

    return (
        <div className="space-y-2">
            {comments.length > 0 && comments.map((comment, idx) => (
                <MessageContent
                    key={comment.comment_uuid}
                    userInfo={comment.comment_by}
                    createdAt={comment.comment_created_at}
                    content={comment.comment_text}
                    rawReactions={comment.comment_reactions}
                    addReaction={(emojiId:string, reactionId: string) => {addOrUpdateReaction(emojiId, reactionId, comment.comment_uuid, idx)}}
                    removeReaction={(reactionId: string)=>{removeReaction(reactionId, comment.comment_uuid, idx)}}
                    deleteMessage={(commentUUID)=>{removeComment(commentUUID, idx)}}
                    updateMessage={(commentUUID, body) => {updateComment(commentUUID, body, idx)}}
                    commentUUID={comment.comment_uuid}
                    getMediaUrl={getMediaURL}
                    attachments={comment.comment_attachments}
                />
            ))}
        </div>
    )
}
