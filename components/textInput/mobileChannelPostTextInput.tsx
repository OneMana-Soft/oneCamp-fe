"use client"

import MinimalTiptapTextInput from "@/components/textInput/textInput";
import { cn } from "@/lib/utils/cn";
import { SendHorizontal } from "lucide-react";
import DraggableDrawer from "@/components/drawers/dragableDrawer";
import { useEffect, useRef, useState } from "react";
import { ChannelFileUpload } from "@/components/fileUpload/channelFileUpload";
import {openChannelCommentFileUpload, openChannelFileUpload} from "@/store/slice/fileUploadSlice";
import {useDispatch, useSelector} from "react-redux";
import {
    addUUIDToLocallyCreatedPost,
    clearChannelInputState,
    createPostLocally,
    updateChannelInputText, updateChannelMessageReplyIncrement
} from "@/store/slice/channelSlice";
import {UserProfileDataInterface, UserProfileInterface} from "@/types/user";
import {CreateOrUpdatePostsReq, CreatePostsRes, PostsResRaw} from "@/types/post";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {usePost} from "@/hooks/usePost";
import {RootState} from "@/store/store";
import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {CreateCommentResInterface, CreateUpdateCommentReqInterface} from "@/types/comment";
import {
    clearChannelCommentMsgInputState,
    createChannelComment,
    createOrUpdateChannelCommentMsg
} from "@/store/slice/channelCommentSlice";
import {ChannelCommentFileUpload} from "@/components/fileUpload/channelCommentFileUpload";
import {removeEmptyPTags} from "@/lib/utils/removeEmptyPTags";

export const MobileChannelPostTextInput = ({ channelId, postUUID }: { channelId: string, postUUID: string }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null); // New ref for the entire content
    const [isExpanded, setIsExpanded] = useState(false);
    const [initialHeight, setInitialHeight] = useState(126); // Default height
    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const dispatch = useDispatch();

    const post = usePost()

    // const postInfo = useFetch<PostsResRaw>(
    //     channelId && postUUID ? `${GetEndpointUrl.GetPostWithAllComments}/${postUUID}` : "",
    // )

    const channelPostState = useSelector((state: RootState) => state.channelComment.commentInputState[channelId] || {});


    useEffect(() => {
        if (!contentRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Update initialHeight based on the entire content height
                setInitialHeight(Math.max(entry.contentRect.height, 30) + 70);
            }
        });

        resizeObserver.observe(contentRef.current);

        return () => resizeObserver.disconnect();
    }, []);


    const handleSend = () => {

        const body = removeEmptyPTags(channelPostState.commentMsgBody)

        if(body.length==0) return


        post.makeRequest<CreateUpdateCommentReqInterface, CreateCommentResInterface>({
            apiEndpoint: PostEndpointUrl.CreatePostComment,
            payload: {
                post_id: postUUID,
                comment_attachments: channelPostState.filesUploaded,
                comment_text_html: body,
            }
        })
            .then((res)=>{

                // postInfo.mutate()

                if(res?.comment_id && selfProfile.data?.data) {
                    dispatch(createChannelComment({commentId: res?.comment_id, commentCreatedAt: res?.comment_created_at, commentText: body, postId: postUUID, commentBy: selfProfile.data?.data, attachments:channelPostState.filesUploaded}))

                }

                // postInfo.mutate()
                dispatch(clearChannelCommentMsgInputState({channelId: channelId}))

                dispatch(updateChannelMessageReplyIncrement({channelId: channelId, messageId: postUUID, comment:{comment_uuid: res?.comment_id||'', comment_created_at: res?.comment_created_at, comment_text: ""}}))



            })
    }

    return (
        <DraggableDrawer isExpanded={isExpanded} setIsExpanded={setIsExpanded} initialHeight={initialHeight}>
            <div ref={contentRef}> {/* Wrap all content in a ref */}
                <div ref={editorRef}>
                    <MinimalTiptapTextInput
                        attachmentOnclick={() => { dispatch(openChannelCommentFileUpload()) }}
                        throttleDelay={300}
                        className={cn("max-w-full rounded-xl h-auto border-none")}
                        editorContentClassName="overflow-auto mb-2"
                        output="html"
                        content={channelPostState.commentMsgBody}
                        placeholder={"message"}
                        editable={true}
                        buttonOnclick={handleSend}
                        ButtonIcon={SendHorizontal}
                        editorClassName="focus:outline-none px-5"
                        onChange={(content ) => {

                            dispatch(createOrUpdateChannelCommentMsg({channelId, body: content as string}))
                        }}
                        fixedToolbarToBottom={true}
                    >



                    </MinimalTiptapTextInput>
                    <div className='pb-6'>
                        <ChannelCommentFileUpload channelId={channelId} />

                    </div>
                </div>
            </div>
        </DraggableDrawer>
    );
};