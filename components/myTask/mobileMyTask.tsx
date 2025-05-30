import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {SearchField} from "@/components/search/searchField";
import {useState} from "react";

export const MobileMyTask = () => {
    const [inputValue, setInputValue] = useState("");
    return (
        <div>
            <SearchField onChange={setInputValue} value={inputValue} placeholder={"Search tasks..."}/>

        </div>
    )
}