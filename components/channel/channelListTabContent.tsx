
import {useMemo, useRef, useState} from "react";
import {SearchField} from "@/components/search/searchField";
import {ChannelListTabActive} from "@/components/channel/channelListTabActive";
import {debounceUtil} from "@/lib/utils/helpers/debounce";
import {ChannelListTabArchive} from "@/components/channel/channelListTabArchive";
import {ChannelListTabAllActive} from "@/components/channel/channelListTabAllActive";



export const ChannelListTabContent = ({selectedTab}: {selectedTab: string}) => {

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

            case 'active':
                return <ChannelListTabActive searchQuery={searchQuery}/>
            case 'archived':
                return <ChannelListTabArchive searchQuery={searchQuery}/>
            case 'join':
                return <ChannelListTabAllActive searchQuery={searchQuery}/>

        }
    }, [searchQuery, selectedTab])


    return (
        <>
            <SearchField onChange={handleChSearchOnChange} value={inputValue} placeholder={"Search channels..."}/>


            {renderTabs}



        </>


)
    ;
}