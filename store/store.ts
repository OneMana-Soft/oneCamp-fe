import { configureStore, combineReducers} from "@reduxjs/toolkit";
import storage from "@/lib/utils/storage";
import { persistReducer, persistStore } from "redux-persist";
import refreshSlice from "@/store/slice/refreshSlice";
import reactionSlice from "@/store/slice/reactionSlice";
import {taskInfoSlice} from "@/store/slice/taskInfoSlice";
import {projectAttachmentSlice} from "@/store/slice/projectAttachmentSlice";
import channelSlice from "@/store/slice/channelSlice";
import chatSlice from "@/store/slice/chatSlice";
import fwdMessageSlice from "@/store/slice/fwdMessageSlice";
import desktopRightPanelSlice from "@/store/slice/desktopRightPanelSlice";
import channelCommentSlice from "@/store/slice/channelCommentSlice";
import {chatCommentSlice} from "@/store/slice/chatCommentSlice";
import userSlice from "@/store/slice/userSlice";
import typingSlice from "@/store/slice/typingSlice";
import {createTaskDialogSlice} from "@/store/slice/createTaskDailogSlice";
import {createTaskCommentSlice} from "@/store/slice/createTaskCommentSlice";
import taskFilterSlice from "@/store/slice/taskFilterSlice";
import currentTaskSlice from "@/store/slice/currentTaskSlice";
import groupChatSlice from "@/store/slice/groupChatSlice";
import {createDocCommentSlice} from "@/store/slice/createDocCommentSlice";
import uiSlice from "@/store/slice/uiSlice";
import mentionSlice from "./slice/mentionSlice";




const rootPersistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [
        // reactionSlice.name,
        // userSlice.name,
    ]
}

const rootReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
    [refreshSlice.name]: refreshSlice.reducer,
    [channelSlice.name]: channelSlice.reducer,
    [uiSlice.name]: uiSlice.reducer,
    [projectAttachmentSlice.name]: projectAttachmentSlice.reducer,
    [createTaskDialogSlice.name]: createTaskDialogSlice.reducer,
    [createTaskCommentSlice.name]: createTaskCommentSlice.reducer,
    [taskInfoSlice.name]: taskInfoSlice.reducer,
    [reactionSlice.name]: reactionSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [groupChatSlice.name]: groupChatSlice.reducer,
    [fwdMessageSlice.name]: fwdMessageSlice.reducer,
    [desktopRightPanelSlice.name]: desktopRightPanelSlice.reducer,
    [typingSlice.name]: typingSlice.reducer,
    [taskFilterSlice.name]: taskFilterSlice.reducer,
    [currentTaskSlice.name]: currentTaskSlice.reducer,
    [createDocCommentSlice.name]: createDocCommentSlice.reducer,
    [channelCommentSlice.name]: channelCommentSlice.reducer,
    [chatCommentSlice.name]: chatCommentSlice.reducer,
    [mentionSlice.name]: mentionSlice.reducer,
});



const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>

export default store;
