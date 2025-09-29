import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import axiosInstance from "@/lib/axiosInstance";
import {useDispatch} from "react-redux";
import {
    addProjectAttachmentPreviewFiles, addProjectAttachmentUploadedFiles, deleteProjectAttachmentPreviewFiles,
    updateProjectAttachmentPreviewFiles
} from "@/store/slice/projectAttachmentSlice";
import {UploadFileInterfaceRes} from "@/types/file";
import {useToast} from "@/hooks/use-toast";
import {useState} from "react";
import { PostFileUploadURL} from "@/services/endPoints";
import {
    addTaskInfoPreviewFiles,
    addTaskInfoUploadedFiles, deleteTaskInfoPreviewFiles,
    updateTaskInfoPreviewFiles
} from "@/store/slice/taskInfoSlice";

import {
    addTaskCommentPreviewFiles,
    addTaskCommentUploadedFiles, deleteTaskCommentPreviewFiles,
    updateTaskCommentPreviewFiles
} from "@/store/slice/createTaskCommentSlice";
import {
    addChatCommentPreviewFiles,
    addChatCommentUploadedFiles, deleteChatCommentPreviewFiles,
    updateChatCommentPreviewFiles, updateChatCommentPreviewFilesUUID
} from "@/store/slice/chatCommentSlice";
import {
    addChannelPreviewFiles, addChannelUploadedFiles,
    deleteChannelPreviewFiles,
    updateChannelPreviewFiles, updateChannelPreviewFilesUUID
} from "@/store/slice/channelSlice";
import {getAttachmentType} from "@/lib/utils/getAttachmentType";
import {
    addChatPreviewFiles,
    addChatUploadedFiles, deleteChatPreviewFiles,
    updateChatPreviewFiles,
    updateChatPreviewFilesUUID
} from "@/store/slice/chatSlice";
import {
    addFwdMsgPreviewFiles, addFwdMsgUploadedFiles, deleteFwdMsgPreviewFiles,
    updateFwdMsgPreviewFiles,
    updateFwdMsgPreviewFilesUUID
} from "@/store/slice/fwdMessageSlice";
import {
    addChannelCommentMsgPreviewFiles,
    addChannelCommentMsgUploadedFiles, deleteChannelCommentMsgPreviewFiles,
    updateChannelCommentMsgPreviewFiles, updateChannelCommentMsgPreviewFilesUUID
} from "@/store/slice/channelCommentSlice";
import {getMediaDimensions} from "@/lib/utils/getMediaDimensions";


interface UploadJson {
    src_key: "project" | "channel" | "public" | "chat"
    src_value?:  string
    channel_uuids?: string[]
    chat_uuids?: string[]
}





const uploadFileToProject = (file: File, projectUUID: string, config: AxiosRequestConfig ={}) => {
    const formData = new FormData();
    formData.append('file', file);

    const jd:UploadJson = {
        src_key: "project",
        src_value: projectUUID,
    }
    const jsonData = JSON.stringify(jd);
    formData.append('jsonData', jsonData);

    return axiosInstance.post(PostFileUploadURL.UploadFile, formData, config).then((res) => res);
}

const uploadFileToChannel = (file: File, channelUUID: string, config: AxiosRequestConfig ={}) => {
    const formData = new FormData();
    formData.append('file', file);

    const jd:UploadJson = {
        src_key: "channel",
        src_value: channelUUID
    }

    const jsonData = JSON.stringify(jd);
    formData.append('jsonData', jsonData);

    return axiosInstance.post(PostFileUploadURL.UploadFile, formData, config).then((res) => res);
}

const uploadFileToChat = (file: File, grpId: string, config: AxiosRequestConfig ={}) => {
    const formData = new FormData();
    formData.append('file', file);

    const jd:UploadJson = {
        src_key: "chat",
        src_value: grpId
    }

    const jsonData = JSON.stringify(jd);
    formData.append('jsonData', jsonData);

    return axiosInstance.post(PostFileUploadURL.UploadFile, formData, config).then((res) => res);
}

const uploadFileToChannelsAndChats = (file: File, chatUUIDs: string[], channelUUIDs: string[], config: AxiosRequestConfig ={}) => {
    const formData = new FormData();
    formData.append('file', file);

    const jd:UploadJson = {
        src_key: "chat",
        channel_uuids: channelUUIDs,
        chat_uuids: chatUUIDs
    }

    const jsonData = JSON.stringify(jd);
    formData.append('jsonData', jsonData);

    return axiosInstance.post(PostFileUploadURL.UploadFile, formData, config).then((res) => res);
}

export const useUploadFile = () => {

    const dispatch = useDispatch();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);



    const makeRequestToUploadToProject = async (files: File[], projectId: string) => {

        const uploadPromises: Promise<AxiosResponse<UploadFileInterfaceRes>>[] = [];


        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const cancelToken = axios.CancelToken.source();
            const uniqueNum = Date.now() + i; // Added i to prevent duplicate keys

            dispatch(
                addProjectAttachmentPreviewFiles({
                    fileUploaded: {
                        key: uniqueNum,
                        fileName: file.name,
                        progress: 0,
                        cancelSource: cancelToken,
                    },
                    projectUUID: projectId,
                })
            );

            setIsSubmitting(true)

            const config: AxiosRequestConfig = {
                cancelToken: cancelToken.token,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total || 100)) * 100
                    );

                    dispatch(
                        updateProjectAttachmentPreviewFiles({
                            progress: progress,
                            key: uniqueNum,
                            projectUUID: projectId,
                        })
                    );
                },
            };

            const uploadPromise = uploadFileToProject(
                    file,
                    projectId,
                    config
                )
                .then((res) => {
                    const uploadMediaRes: UploadFileInterfaceRes = res.data;

                    dispatch(
                        addProjectAttachmentUploadedFiles({
                            filesUploaded: {
                                fileName: file.name,
                                key: uniqueNum,
                                url: uploadMediaRes.object_uuid,
                            },
                            projectUUID: projectId,
                        })
                    );
                    return res;
                })
                .catch((error) => {
                    dispatch(
                        deleteProjectAttachmentPreviewFiles({
                            key: uniqueNum,
                            projectUUID: projectId,
                        })
                    );

                    toast({
                        title: "Error",
                        description: `error while uploading file: ${file.name}`,
                        variant: 'destructive'
                    });
                    throw error; // Re-throw to be caught by Promise.allSettled
                });

            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete (success or failure)
        try {
            await Promise.allSettled(uploadPromises);
        } catch (error) {
            console.error("Error in upload batch:", error);
        }finally {
            setIsSubmitting(false)
        }

        return
    }


    const makeRequestToUploadToTask = async (files: File[], taskId: string, projectId: string) => {

        const uploadPromises: Promise<AxiosResponse<UploadFileInterfaceRes>>[] = [];


        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const cancelToken = axios.CancelToken.source();
            const uniqueNum = Date.now() + i; // Added i to prevent duplicate keys

            const mediaInfo = await getMediaDimensions(file);


            dispatch(
                addTaskInfoPreviewFiles({
                    fileUploaded: {
                        key: uniqueNum,
                        fileName: file.name,
                        progress: 0,
                        cancelSource: cancelToken,
                    },
                    taskUUID: taskId,
                })
            );

            setIsSubmitting(true)

            const config: AxiosRequestConfig = {
                cancelToken: cancelToken.token,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total || 100)) * 100
                    );

                    dispatch(
                        updateTaskInfoPreviewFiles({
                            progress: progress,
                            key: uniqueNum,
                            taskUUID: taskId,
                        })
                    );
                },
            };

            const uploadPromise = uploadFileToProject(
                file,
                projectId,
                config
            )
                .then((res) => {
                    const uploadMediaRes: UploadFileInterfaceRes = res.data;

                    dispatch(
                        addTaskInfoUploadedFiles({
                            filesUploaded: {
                                fileName: file.name,
                                key: uniqueNum,
                                url: uploadMediaRes.object_uuid,
                            },
                            taskUUID: taskId,
                        })
                    );
                    return res;
                })
                .catch((error) => {
                    dispatch(
                        deleteTaskInfoPreviewFiles({
                            key: uniqueNum,
                            taskUUID: taskId,
                        })
                    );

                    toast({
                        title: "Error",
                        description: `error while uploading file: ${file.name}`,
                        variant: 'destructive'
                    });
                    throw error; // Re-throw to be caught by Promise.allSettled
                });

            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete (success or failure)
        try {
            await Promise.allSettled(uploadPromises);
        } catch (error) {
            console.error("Error in upload batch:", error);
        }finally {
            setIsSubmitting(false)
        }

        return
    }

    const makeRequestToUploadToTaskComment = async (files: File[], projectId: string, taskId: string) => {

        const uploadPromises: Promise<AxiosResponse<UploadFileInterfaceRes>>[] = [];


        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const cancelToken = axios.CancelToken.source();
            const uniqueNum = Date.now() + i; // Added i to prevent duplicate keys

            dispatch(
                addTaskCommentPreviewFiles({
                    fileUploaded: {
                        key: uniqueNum,
                        fileName: file.name,
                        progress: 0,
                        cancelSource: cancelToken,
                    },
                    taskUUID: taskId,
                })
            );

            setIsSubmitting(true)

            const config: AxiosRequestConfig = {
                cancelToken: cancelToken.token,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total || 100)) * 100
                    );

                    dispatch(
                        updateTaskCommentPreviewFiles({
                            progress: progress,
                            key: uniqueNum,
                            taskUUID: taskId,
                        })
                    );
                },
            };

            const uploadPromise = uploadFileToProject(
                file,
                projectId,
                config
            )
                .then((res) => {
                    const uploadMediaRes: UploadFileInterfaceRes = res.data;

                    dispatch(
                        addTaskCommentUploadedFiles({
                            filesUploaded: {
                                fileName: file.name,
                                key: uniqueNum,
                                url: uploadMediaRes.object_uuid,
                            },
                            taskUUID: taskId,
                        })
                    );
                    return res;
                })
                .catch((error) => {
                    dispatch(
                        deleteTaskCommentPreviewFiles({
                            key: uniqueNum,
                            taskUUID: taskId,
                        })
                    );

                    toast({
                        title: "Error",
                        description: `error while uploading file: ${file.name}`,
                        variant: 'destructive'
                    });
                    throw error; // Re-throw to be caught by Promise.allSettled
                });

            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete (success or failure)
        try {
            await Promise.allSettled(uploadPromises);
        } catch (error) {
            console.error("Error in upload batch:", error);
        }finally {
            setIsSubmitting(false)
        }

        return
    }

    const makeRequestToUploadToChannelComment = async (files: FileList, channelId: string) => {

        const uploadPromises: Promise<AxiosResponse<UploadFileInterfaceRes>>[] = [];


        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const cancelToken = axios.CancelToken.source();
            const uniqueNum = (Date.now() + i).toString(); // Added i to prevent duplicate keys
            const mediaInfo = await getMediaDimensions(file);


            const currentDate = new Date().toISOString();
            const attachmentType = getAttachmentType(file.name)

            dispatch(
                addChannelCommentMsgPreviewFiles({
                    filesUploaded: {
                        key: uniqueNum,
                        fileName: file.name,
                        progress: 0,
                        cancelSource: cancelToken,
                        attachmentType: attachmentType
                    },
                    channelId: channelId
                })
            );

            setIsSubmitting(true)

            const config: AxiosRequestConfig = {
                cancelToken: cancelToken.token,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total || 100)) * 100
                    );

                    dispatch(
                        updateChannelCommentMsgPreviewFiles({
                            progress: progress,
                            key: uniqueNum,
                            channelId: channelId
                        })
                    );
                },
            };

            const uploadPromise = uploadFileToChannel(
                file,
                channelId,
                config
            )
                .then((res) => {
                    const uploadMediaRes: UploadFileInterfaceRes = res.data;

                    dispatch(updateChannelCommentMsgPreviewFilesUUID({
                        channelId,
                        key: uniqueNum,
                        uuid: uploadMediaRes.object_uuid,
                    }))

                    dispatch(
                        addChannelCommentMsgUploadedFiles({
                            filesUploaded: {
                                attachment_file_name: file.name,
                                attachment_obj_key: uniqueNum,
                                attachment_uuid: uploadMediaRes.object_uuid,
                                attachment_size: file.size,
                                attachment_created_at: currentDate,
                                attachment_type: attachmentType,
                                attachment_duration: mediaInfo.duration,
                                attachment_height: mediaInfo.height,
                                attachment_width: mediaInfo.width,
                                attachment_raw_type: file.type
                            },
                            channelId: channelId,
                        })
                    );
                    return res;
                })
                .catch((error) => {
                    dispatch(
                        deleteChannelCommentMsgPreviewFiles({
                            key: uniqueNum,
                            channelId,
                        })
                    );

                    toast({
                        title: "Error",
                        description: `error while uploading file: ${file.name}`,
                        variant: 'destructive'
                    });
                    throw error; // Re-throw to be caught by Promise.allSettled
                });

            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete (success or failure)
        try {
            await Promise.allSettled(uploadPromises);
        } catch (error) {
            console.error("Error in upload batch:", error);
        }finally {
            setIsSubmitting(false)
        }

        return
    }



    const makeRequestToUploadToChatComment = async (files: FileList, chatMessageUUID: string, grpId: string) => {

        const uploadPromises: Promise<AxiosResponse<UploadFileInterfaceRes>>[] = [];


        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const cancelToken = axios.CancelToken.source();
            const uniqueNum = (Date.now() + i).toString(); // Added i to prevent duplicate keys
            const mediaInfo = await getMediaDimensions(file);


            const currentDate = new Date().toISOString();
            const attachmentType = getAttachmentType(file.name)

            dispatch(
                addChatCommentPreviewFiles({
                    fileUploaded: {
                        key: uniqueNum,
                        fileName: file.name,
                        progress: 0,
                        cancelSource: cancelToken,
                        attachmentType: attachmentType
                    },
                    chatUUID: chatMessageUUID
                })
            );

            setIsSubmitting(true)

            const config: AxiosRequestConfig = {
                cancelToken: cancelToken.token,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total || 100)) * 100
                    );

                    dispatch(
                        updateChatCommentPreviewFiles({
                            progress: progress,
                            key: uniqueNum,
                            chatUUID: chatMessageUUID
                        })
                    );
                },
            };

            const uploadPromise = uploadFileToChat(
                file,
                grpId,
                config
            )
                .then((res) => {
                    const uploadMediaRes: UploadFileInterfaceRes = res.data;

                    dispatch(updateChatCommentPreviewFilesUUID({
                        chatUUID: chatMessageUUID,
                        key: uniqueNum,
                        uuid: uploadMediaRes.object_uuid,
                    }))

                    dispatch(
                        addChatCommentUploadedFiles({
                            filesUploaded: {
                                attachment_file_name: file.name,
                                attachment_obj_key: uniqueNum,
                                attachment_uuid: uploadMediaRes.object_uuid,
                                attachment_size: file.size,
                                attachment_created_at: currentDate,
                                attachment_type: attachmentType,
                                attachment_duration: mediaInfo.duration,
                                attachment_height: mediaInfo.height,
                                attachment_width: mediaInfo.width,
                                attachment_raw_type: file.type
                            },
                            chatUUID: chatMessageUUID,
                        })
                    );
                    return res;
                })
                .catch((error) => {
                    dispatch(
                        deleteChatCommentPreviewFiles({
                            key: uniqueNum,
                            chatUUID: chatMessageUUID,
                        })
                    );

                    toast({
                        title: "Error",
                        description: `error while uploading file: ${file.name}`,
                        variant: 'destructive'
                    });
                    throw error; // Re-throw to be caught by Promise.allSettled
                });

            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete (success or failure)
        try {
            await Promise.allSettled(uploadPromises);
        } catch (error) {
            console.error("Error in upload batch:", error);
        }finally {
            setIsSubmitting(false)
        }

        return
    }

    const makeRequestToUploadToChannel = async (files: FileList, channelId: string) => {

        const uploadPromises: Promise<AxiosResponse<UploadFileInterfaceRes>>[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const cancelToken = axios.CancelToken.source();
            const uniqueNum = (Date.now() + i).toString() // Added i to prevent duplicate keys

            const currentDate = new Date().toISOString();
            const attachmentType = getAttachmentType(file.name)


            const mediaInfo = await getMediaDimensions(file);


            dispatch(
                addChannelPreviewFiles({
                    filesUploaded: {
                        key: uniqueNum,
                        fileName: file.name,
                        progress: 0,
                        cancelSource: cancelToken,
                        attachmentType
                    },
                    channelId
                })
            );

            setIsSubmitting(true)



            const config: AxiosRequestConfig = {
                cancelToken: cancelToken.token,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total || 100)) * 100
                    );

                    dispatch(
                        updateChannelPreviewFiles({
                            progress: progress,
                            key: uniqueNum,
                            channelId
                        })
                    );
                },
            };

            const uploadPromise = uploadFileToChannel(
                file,
                channelId,
                config
            )
                .then((res) => {
                    const uploadMediaRes: UploadFileInterfaceRes = res.data;


                    dispatch(updateChannelPreviewFilesUUID({
                        channelId,
                        key: uniqueNum,
                        uuid: uploadMediaRes.object_uuid,
                    }))

                    dispatch(
                        addChannelUploadedFiles({
                            filesUploaded: {
                                attachment_file_name: file.name,
                                attachment_obj_key: uniqueNum,
                                attachment_uuid: uploadMediaRes.object_uuid,
                                attachment_size: file.size,
                                attachment_created_at: currentDate,
                                attachment_type: attachmentType,
                                attachment_duration: mediaInfo.duration,
                                attachment_height: mediaInfo.height,
                                attachment_width: mediaInfo.width,
                                attachment_raw_type: file.type
                            },
                            channelId,
                        })
                    );
                    return res;
                })
                .catch((error) => {
                    dispatch(
                        deleteChannelPreviewFiles({
                            key: uniqueNum,
                            channelId,
                        })
                    );

                    toast({
                        title: "Error",
                        description: `error while uploading file: ${file.name}`,
                        variant: 'destructive'
                    });
                    throw error; // Re-throw to be caught by Promise.allSettled
                });

            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete (success or failure)
        try {
            await Promise.allSettled(uploadPromises);
        } catch (error) {
            console.error("Error in upload batch:", error);
        }finally {
            setIsSubmitting(false)
        }

        return
    }

    const makeRequestToUploadToChatAndChannels = async (files: FileList, chatUUIDs: string[], channelUUIDs: string[]) => {

        const uploadPromises: Promise<AxiosResponse<UploadFileInterfaceRes>>[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const cancelToken = axios.CancelToken.source();
            const uniqueNum = (Date.now() + i).toString() // Added i to prevent duplicate keys
            const mediaInfo = await getMediaDimensions(file);


            const currentDate = new Date().toISOString();
            const attachmentType = getAttachmentType(file.name)

            dispatch(
                addFwdMsgPreviewFiles({
                    filesUploaded: {
                        key: uniqueNum,
                        fileName: file.name,
                        progress: 0,
                        cancelSource: cancelToken,
                        attachmentType
                    },
                })
            );

            setIsSubmitting(true)

            const config: AxiosRequestConfig = {
                cancelToken: cancelToken.token,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total || 100)) * 100
                    );

                    dispatch(
                        updateFwdMsgPreviewFiles({
                            progress: progress,
                            key: uniqueNum,
                        })
                    );
                },
            };

            const uploadPromise = uploadFileToChannelsAndChats(
                file,
                chatUUIDs,
                channelUUIDs,
                config
            )
                .then((res) => {
                    const uploadMediaRes: UploadFileInterfaceRes = res.data;

                    dispatch(updateFwdMsgPreviewFilesUUID({
                        key: uniqueNum,
                        uuid: uploadMediaRes.object_uuid,
                    }))

                    dispatch(
                        addFwdMsgUploadedFiles({
                            filesUploaded: {
                                attachment_file_name: file.name,
                                attachment_obj_key: uniqueNum,
                                attachment_uuid: uploadMediaRes.object_uuid,
                                attachment_size: file.size,
                                attachment_created_at: currentDate,
                                attachment_type: attachmentType,
                                attachment_duration: mediaInfo.duration,
                                attachment_height: mediaInfo.height,
                                attachment_width: mediaInfo.width
                            },
                        })
                    );
                    return res;
                })
                .catch((error) => {
                    dispatch(
                        deleteFwdMsgPreviewFiles({
                            key: uniqueNum,
                        })
                    );

                    toast({
                        title: "Error",
                        description: `error while uploading file: ${file.name}`,
                        variant: 'destructive'
                    });
                    throw error; // Re-throw to be caught by Promise.allSettled
                });

            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete (success or failure)
        try {
            await Promise.allSettled(uploadPromises);
        } catch (error) {
            console.error("Error in upload batch:", error);
        }finally {
            setIsSubmitting(false)
        }

        return
    }


    const makeRequestToUploadToChat = async (files: FileList, chatUUID: string, grpId: string) => {

        const uploadPromises: Promise<AxiosResponse<UploadFileInterfaceRes>>[] = [];


        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const cancelToken = axios.CancelToken.source();
            const uniqueNum = (Date.now() + i).toString() // Added i to prevent duplicate keys

            const mediaInfo = await getMediaDimensions(file);

            const currentDate = new Date().toISOString();
            const attachmentType = getAttachmentType(file.name)

            dispatch(
                addChatPreviewFiles({
                    filesUploaded: {
                        key: uniqueNum,
                        fileName: file.name,
                        progress: 0,
                        cancelSource: cancelToken,
                        attachmentType
                    },
                    chatUUID
                })
            );

            setIsSubmitting(true)

            const config: AxiosRequestConfig = {
                cancelToken: cancelToken.token,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total || 100)) * 100
                    );

                    dispatch(
                        updateChatPreviewFiles({
                            progress: progress,
                            key: uniqueNum,
                            chatUUID
                        })
                    );
                },
            };

            const uploadPromise = uploadFileToChat(
                file,
                grpId,
                config
            )
                .then((res) => {
                    const uploadMediaRes: UploadFileInterfaceRes = res.data;

                    dispatch(updateChatPreviewFilesUUID({
                        chatUUID,
                        key: uniqueNum,
                        uuid: uploadMediaRes.object_uuid,
                    }))

                    dispatch(
                        addChatUploadedFiles({
                            filesUploaded: {
                                attachment_file_name: file.name,
                                attachment_obj_key: uniqueNum,
                                attachment_uuid: uploadMediaRes.object_uuid,
                                attachment_size: file.size,
                                attachment_created_at: currentDate,
                                attachment_type: attachmentType,
                                attachment_width: mediaInfo.width,
                                attachment_height: mediaInfo.height,
                                attachment_duration: mediaInfo.duration,
                                attachment_raw_type: file.type
                            },
                            chatUUID,
                        })
                    );
                    return res;
                })
                .catch((error) => {
                    dispatch(
                        deleteChatPreviewFiles({
                            key: uniqueNum,
                            chatUUID,
                        })
                    );

                    toast({
                        title: "Error",
                        description: `error while uploading file: ${file.name}`,
                        variant: 'destructive'
                    });
                    throw error; // Re-throw to be caught by Promise.allSettled
                });

            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete (success or failure)
        try {
            await Promise.allSettled(uploadPromises);
        } catch (error) {
            console.error("Error in upload batch:", error);
        }finally {
            setIsSubmitting(false)
        }

        return
    }



    return {makeRequestToUploadToChannel, makeRequestToUploadToChannelComment, makeRequestToUploadToProject, makeRequestToUploadToTask, makeRequestToUploadToTaskComment, makeRequestToUploadToChatComment, makeRequestToUploadToChat, makeRequestToUploadToChatAndChannels, isSubmitting}
}