
import {useMemo, useRef, useState} from "react";
import {SearchField} from "@/components/search/searchField";
import {debounceUtil} from "@/lib/utils/helpers/debounce";

import {TeamListTabProject} from "@/components/team/TeamListTabProject";



export const TeamListTabContent = ({ teamId}: { teamId: string}) => {

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

        // if (chName !== '') {
            debouncedSearch(chName);
        // }

    }


    return (
        <div>
            <SearchField onChange={handleChSearchOnChange} value={inputValue} placeholder={"Search project..."}/>


            <TeamListTabProject searchQuery={searchQuery} teamId={teamId}/>



        </div>


)
    ;
}