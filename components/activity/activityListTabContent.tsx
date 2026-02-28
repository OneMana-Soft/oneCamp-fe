
import {useMemo, useRef, useState} from "react";
import {SearchField} from "@/components/search/searchField";
import {ChannelListTabActive} from "@/components/channel/channelListTabActive";
import {debounceUtil} from "@/lib/utils/helpers/debounce";
import {ChannelListTabArchive} from "@/components/channel/channelListTabArchive";
import {ChannelListTabAllActive} from "@/components/channel/channelListTabAllActive";
import {ActivityMentionListResult} from "@/components/activity/activityMentionListResult";
import {ActivityCommentListResult} from "@/components/activity/activityCommentListResult";
import {ActivityReactionListResult} from "@/components/activity/activityReactionListResult";
import {ActivityAllListResult} from "@/components/activity/activityAllListResult";



export const ActivityListTabContent = ({selectedTab}: {selectedTab: string}) => {



    const renderTabs =  useMemo(() => {

        switch (selectedTab) {

            case 'all':
                return <ActivityAllListResult/>
            case 'mentions':
                return <ActivityMentionListResult />
            case 'comments':
                return <ActivityCommentListResult/>
            case 'reactions':
                return <ActivityReactionListResult />

        }
    }, [ selectedTab])


    return (
        <>


            {renderTabs}



        </>


)
    ;
}