
import {useMemo, useState} from "react";
import {SearchField} from "@/components/search/searchField";
import {ChannelListTabActive} from "@/components/channel/channelListTabActive";
import {debounceUtil} from "@/lib/utils/helpers/debounce";
import {ChannelListTabArchive} from "@/components/channel/channelListTabArchive";
import {ChannelListTabAllActive} from "@/components/channel/channelListTabAllActive";
import {ProjectList} from "@/components/project/ProjectList";
import {ProjectAttachmentList} from "@/components/project/projectAttachmentList";
import {ProjectTaskList} from "@/components/project/projectTaskList";



export const ProjectListTabContent = ({selectedTab, projectId}: {selectedTab: string, projectId: string}) => {

    const [inputValue, setInputValue] = useState("")

    const [searchQuery, setSearchQuery] = useState("")


    const debouncedSearch = useMemo(() =>
            debounceUtil((searchString: string) => {
                setSearchQuery(searchString.trim())
            }, 500),
        []
    )

    const handleChSearchOnChange = (chName: string) => {
        setInputValue(chName);


        debouncedSearch(chName);


    }

    const renderTabs =  useMemo(() => {

        switch (selectedTab) {

            case 'task':
                return <ProjectTaskList searchQuery={searchQuery} projectId={projectId}/>
            case 'attachment':
                return <ProjectAttachmentList searchQuery={searchQuery} projectId={projectId}/>


        }
    }, [searchQuery, selectedTab])


    return (
        <>
            <SearchField onChange={handleChSearchOnChange} value={inputValue} placeholder={`Search ${selectedTab}...`}/>


            {renderTabs}



        </>


    )
        ;
}