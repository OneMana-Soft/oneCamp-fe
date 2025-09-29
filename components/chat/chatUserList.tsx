import {SearchField} from "@/components/search/searchField";
import {useEffect, useMemo, useState} from "react";
import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";

import {
    USER_STATUS_ONLINE,
    UserDMSearchTextInterface,
    UserProfileDataInterface,
    UserProfileInterface
} from "@/types/user";
import {debounceUtil} from "@/lib/utils/debounce";
import {usePost} from "@/hooks/usePost";
import ChatUserListUser from "@/components/chat/chatUserListUser";
import { app_chat_path} from "@/types/paths";
import {useRouter} from "next/navigation";
import {RootState} from "@/store/store";
import {useDispatch, useSelector} from "react-redux";
import {CreateUserChatList} from "@/store/slice/chatSlice";
import {sortChatList} from "@/lib/utils/sortChatList";

export const ChatUserList = ({chatId}: {chatId: string}) => {

    const router = useRouter();

    const dispatch = useDispatch();

    const latestChats = useFetch<UserProfileInterface>(GetEndpointUrl.GetUserLatestChatList)
    const [dmSearchText, setDmSearchText] = useState('')

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const post = usePost()

    const [searchDmList, setSearchDmList ] = useState<UserProfileDataInterface[] | null>(null)

    const [sortedDmList, setSortedDmList ] = useState<UserProfileDataInterface[] | null>(null)


    const userChatListState = useSelector((state: RootState) => state.chat.latestChatList || []);


    useEffect(() => {


        if(latestChats.data?.data.user_dms && selfProfile.data?.data.user_uuid) {

            const tempUserDmListProcessed: UserProfileDataInterface[] = [] as UserProfileDataInterface[]


            for (const dm of latestChats.data.data.user_dms) {
                const tempUser: UserProfileDataInterface = {} as UserProfileDataInterface
                if(dm.dm_chats[0].chat_to.user_uuid == selfProfile.data?.data.user_uuid) {
                    tempUser.user_uuid =  dm.dm_chats[0].chat_from.user_uuid
                    tempUser.user_name =  dm.dm_chats[0].chat_from.user_name
                    tempUser.user_profile_object_key =  dm.dm_chats[0].chat_from.user_profile_object_key
                    tempUser.user_status = dm.dm_chats[0].chat_from.user_status
                    tempUser.user_device_connected =  dm.dm_chats[0].chat_from.user_device_connected

                } else {
                    tempUser.user_uuid =  dm.dm_chats[0].chat_to.user_uuid
                    tempUser.user_name =  dm.dm_chats[0].chat_to.user_name
                    tempUser.user_profile_object_key =  dm.dm_chats[0].chat_to.user_profile_object_key
                    tempUser.user_status = dm.dm_chats[0].chat_to.user_status
                    tempUser.user_device_connected =  dm.dm_chats[0].chat_to.user_device_connected
                }



                tempUser.user_dms = [dm]


                tempUserDmListProcessed.push(tempUser)

            }


            dispatch(CreateUserChatList({userList: tempUserDmListProcessed}))
        }

    },[latestChats.data?.data, selfProfile.data?.data.user_uuid])


    const debouncedSearch = useMemo(() =>
            debounceUtil((dmName: string) => {
                if(dmName.length == 0) return;
                post.makeRequest<UserDMSearchTextInterface, UserProfileDataInterface[]>({
                    apiEndpoint: PostEndpointUrl.SearchChatWithUser,
                    payload: {
                        search_text: dmName,
                    }
                }).then((resp) => {
                    if(resp) {
                        setSearchDmList(resp);
                    }
                });
            }, 500),
        [] // Empty dependency array - only create once
    );

    const renderDmList = dmSearchText && searchDmList ? searchDmList: userChatListState


    useEffect(() => {

        if(renderDmList) {
            const tempList = sortChatList(renderDmList)
            setSortedDmList(tempList)
        }
    }, [renderDmList]);

    const handleDmSearchOnChange = (dmName: string) => {
        setDmSearchText(dmName);



        if (dmName !== '') {
            debouncedSearch(dmName);
        }

    }

    const handleDmListOnClick = async (dmId: string) => {
        // dispatch(updateSideBarState({active: false}))
        // dispatch(updateLastSeenDmId({dmId}));

        router.push(app_chat_path + '/' + dmId);
    }


    return (
        <div>
            <SearchField onChange={handleDmSearchOnChange} value={dmSearchText} placeholder={"Search users..."}/>

            <div className="overflow-y-auto sidebax-extended-channels h-full">
                {sortedDmList && sortedDmList.map((dmData, index) => {

                    return (<div key={index}>
                        {index !== 0 && <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700"/>}
                        <div onClick={() => handleDmListOnClick(dmData.user_uuid)}>
                            <ChatUserListUser
                                lastMessageTime={dmData.user_dms && dmData.user_dms[0] && dmData.user_dms[0].dm_chats && dmData.user_dms[0].dm_chats[0].chat_created_at || ''}
                                lastUserMessage={dmData.user_dms && dmData.user_dms[0] && dmData.user_dms[0].dm_chats && dmData.user_dms[0].dm_chats[0].chat_body_text || ''}
                                lastUsername={dmData.user_dms && dmData.user_dms[0] && dmData.user_dms[0].dm_chats && dmData.user_dms[0].dm_chats[0].chat_from.user_name || ''}
                                userName={dmData.user_name}
                                unseenMessageCount={dmData.user_dms && dmData.user_dms[0] && dmData.user_dms[0].dm_unread || 0}
                                userProfileKey={dmData.user_profile_object_key}
                                userSelected={chatId == dmData.user_uuid}
                                attachmentCount={dmData.user_dms && dmData.user_dms[0] && dmData.user_dms[0].dm_chats && dmData.user_dms[0].dm_chats[0].chat_attachments?.length || 0}
                                key={index}
                                isSelfDm={dmData.user_uuid === selfProfile.data?.data.user_uuid}
                                isOnline={(dmData.user_device_connected && dmData.user_status) ? dmData.user_status == USER_STATUS_ONLINE && dmData.user_device_connected > 0 : false}
                            />
                        </div>
                    </div>)

                })}
                {dmSearchText && searchDmList && searchDmList.length == 0 && (
                    <div className='text-destructive'>Colleague not available</div>)}
            </div>

        </div>

    )
}