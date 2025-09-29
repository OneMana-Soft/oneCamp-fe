import { configureStore, combineReducers} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import refreshSlice from "@/store/slice/refreshSlice";
import dialogSlice from "@/store/slice/dialogSlice";
import drawerSlice from "@/store/slice/drawerSlice";
import sheetSlice from "@/store/slice/sheetSlice";
import popoverSlice from "@/store/slice/popoverSlice";
import reactionSlice from "@/store/slice/reactionSlice";
import {taskInfoSlice} from "@/store/slice/taskInfoSlice";
import {projectAttachmentSlice} from "@/store/slice/projectAttachmentSlice";
import fileUploadSlice from "@/store/slice/fileUploadSlice";
import channelSlice from "@/store/slice/channelSlice";
import chatSlice from "@/store/slice/chatSlice";
import fwdMessageSlice from "@/store/slice/fwdMessageSlice";
import desktopRightPanelSlice from "@/store/slice/desktopRightPanelSlice";
import channelCommentSlice from "@/store/slice/channelCommentSlice";
import {chatCommentSlice} from "@/store/slice/chatCommentSlice";
import userSlice from "@/store/slice/userSlice";
import typingSlice from "@/store/slice/typingSlice";


const rootPersistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [
        reactionSlice.name,
        // channelSlice.name,
        taskInfoSlice.name,
        projectAttachmentSlice.name,
        // dmSlice.name,
        // chatSlice.name
    ]
}

const rootReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
    [refreshSlice.name]: refreshSlice.reducer,
    [channelSlice.name]: channelSlice.reducer,
    [dialogSlice.name]: dialogSlice.reducer,
    [drawerSlice.name]: drawerSlice.reducer,
    [sheetSlice.name]: sheetSlice.reducer,
    [popoverSlice.name]: popoverSlice.reducer,
    [channelCommentSlice.name]: channelCommentSlice.reducer,
    [chatCommentSlice.name]: chatCommentSlice.reducer,
    [reactionSlice.name]: reactionSlice.reducer,
    [fileUploadSlice.name]: fileUploadSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [fwdMessageSlice.name]: fwdMessageSlice.reducer,
    [desktopRightPanelSlice.name]: desktopRightPanelSlice.reducer,
    [typingSlice.name]: typingSlice.reducer
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
