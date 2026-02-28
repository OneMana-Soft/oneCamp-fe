
import {useMemo,  useState} from "react";
import {SearchField} from "@/components/search/searchField";
import {debounceUtil} from "@/lib/utils/helpers/debounce";

import {ProjectList} from "@/components/project/ProjectList";



export const ProjectListContent = () => {

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


            <ProjectList searchQuery={searchQuery}/>



        </div>


)
    ;
}