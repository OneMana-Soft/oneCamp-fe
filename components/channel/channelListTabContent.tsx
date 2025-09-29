
import {useMemo, useRef, useState} from "react";
import {SearchField} from "@/components/search/searchField";
import {ChannelListTabActive} from "@/components/channel/channelListTabActive";
import {debounceUtil} from "@/lib/utils/debounce";
import {ChannelListTabArchive} from "@/components/channel/channelListTabArchive";



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

        if (chName !== '') {
            debouncedSearch(chName);
        }

    }

    const renderTabs =  useMemo(() => {

        switch (selectedTab) {

            case 'active':
                return <ChannelListTabActive searchQuery={searchQuery}/>
            case 'archive':
                return <ChannelListTabArchive searchQuery={searchQuery}/>

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