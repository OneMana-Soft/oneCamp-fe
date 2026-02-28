import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@/store/store"
import type { DocCommentInputState } from "@/store/slice/createDocCommentSlice"
import type { CommentInfoInterface } from "@/types/comment"

/** Stable default references to avoid new object/array on each selector call */
const EMPTY_DOC_COMMENT_INPUT_STATE: DocCommentInputState = {
    commentBody: "",
    filesUploaded: [],
    filesPreview: [],
}

const EMPTY_DOC_COMMENTS: CommentInfoInterface[] = []

const selectDocCommentInputStateMap = (state: RootState) =>
    state.createDocComment.docCommentInputState
const selectDocCommentsMap = (state: RootState) => state.createDocComment.docComments

/** Memoized selector for doc comment input state. Use with useSelector(selectDocCommentInputState(docId)). */
export const selectDocCommentInputState = createSelector(
    [selectDocCommentInputStateMap, (_state: RootState, docId: string) => docId],
    (inputState, docId) =>
        inputState[docId] ?? EMPTY_DOC_COMMENT_INPUT_STATE,
)

/** Memoized selector for doc comments. Use with useSelector(selectDocComments(docId)). */
export const selectDocComments = createSelector(
    [selectDocCommentsMap, (_state: RootState, docId: string) => docId],
    (commentsMap, docId) => commentsMap[docId] ?? EMPTY_DOC_COMMENTS,
)
