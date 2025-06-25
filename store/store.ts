import { configureStore, combineReducers} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import refreshSlice from "@/store/slice/refreshSlice";
import dialogSlice from "@/store/slice/dialogSlice";
import drawerSlice from "@/store/slice/drawerSlice";
import sheetSlice from "@/store/slice/sheetSlice";
import popoverSlice from "@/store/slice/popoverSlice";
import reactionSlice from "@/store/slice/reactionSlice";
import postSlice from "@/store/slice/postSlice";
import {taskInfoSlice} from "@/store/slice/taskInfoSlice";
import {projectAttachmentSlice} from "@/store/slice/projectAttachmentSlice";
import rightPanelSlice from "@/store/slice/rightPanelSlice";
import fileUploadSlice from "@/store/slice/fileUploadSlice";
import channelSlice from "@/store/slice/channelSlice";
import chatSlice from "@/store/slice/chatSlice";
import fwdMessageSlice from "@/store/slice/fwdMessageSlice";


const rootPersistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [
        reactionSlice.name,
        // channelSlice.name,
        postSlice.name,
        taskInfoSlice.name,
        projectAttachmentSlice.name,
        // dmSlice.name,
        // chatSlice.name
    ]
}

const rootReducer = combineReducers({
    [refreshSlice.name]: refreshSlice.reducer,
    [channelSlice.name]: channelSlice.reducer,
    [dialogSlice.name]: dialogSlice.reducer,
    [drawerSlice.name]: drawerSlice.reducer,
    [sheetSlice.name]: sheetSlice.reducer,
    [popoverSlice.name]: popoverSlice.reducer,
    [reactionSlice.name]: reactionSlice.reducer,
    [rightPanelSlice.name]: rightPanelSlice.reducer,
    [fileUploadSlice.name]: fileUploadSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [fwdMessageSlice.name]: fwdMessageSlice.reducer
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
