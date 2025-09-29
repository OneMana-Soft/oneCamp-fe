import {ChannelListTabs} from "@/components/channel/channelListTabs";
import {useFetch} from "@/hooks/useFetch";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {ChannelInfoInterface, ChannelInfoListInterfaceResp} from "@/types/channel";
import {useEffect, useState} from "react";
import {GenericSearchTextInterface, UserDMSearchTextInterface, UserProfileDataInterface} from "@/types/user";
import {usePost} from "@/hooks/usePost";
import {ChannelListResult} from "@/components/channel/chnnelListResult";
import {sortChannelList} from "@/lib/utils/sortChannelList";

export const ChannelListTabActive = ({searchQuery}:{searchQuery: string}) => {


    const post = usePost();
    const channelList = useFetch<ChannelInfoListInterfaceResp>(GetEndpointUrl.GetUserActiveChannelList)

    const [searchChannelList, setSearchChannelList] = useState<ChannelInfoInterface[]>()

    const [sortedChannelList, setSortedChannelList] = useState<ChannelInfoInterface[]>([])


    useEffect(()=>{

        if(searchQuery.trim().length == 0) return


        post.makeRequest<GenericSearchTextInterface, ChannelInfoInterface[] >({
            apiEndpoint: PostEndpointUrl.SearchActiveUserChannelList,
            payload: {
                search_text: searchQuery,
            }

        }).then((resp)=>{
            if(resp) {
                setSearchChannelList(resp);
            }
        })

    }, [searchQuery])

    const renderChannelList =  searchQuery && searchChannelList ? searchChannelList: channelList.data?.channels_list


    useEffect(() => {

        if(renderChannelList) {
            const sortedChannelList = sortChannelList(renderChannelList)
            setSortedChannelList(sortedChannelList)
        }


    }, [renderChannelList]);


    return (
        <>
            {renderChannelList && <ChannelListResult channelList={sortedChannelList}/>}
        </>
    )
}