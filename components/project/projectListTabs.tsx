"use client"


import {Circle, Hash} from "lucide-react";
import {ChannelListTabContent} from "@/components/channel/channelListTabContent";
import {useState} from "react";
import {useMedia} from "@/context/MediaQueryContext";
import {ProjectListTabContent} from "@/components/project/projectListTabContent";

export function ProjectListTabs({projectId}:{projectId: string}) {

    const [selectedTab, setSelectedTab] = useState("task");

    const handleChangeTab = (t: string) => {
        setSelectedTab(t);
    }


    return (
        <div className='flex flex-col h-full'>

            <div>
                <div
                    className='h-10 md:h-16 text-sm  flex w-full md:w-[25vw]   justify-around items-center p-1.5 space-x-3 md:p-4 md:ml-2'>

                    <div onClick={() => handleChangeTab('task')}
                         className={`md:border hover:cursor-pointer md:h-8 flex justify-center items-center  h-full w-full text-center rounded-md  ${selectedTab == 'task' ? 'bg-primary' : ""}`}>
                        Tasks
                    </div>
                    <div onClick={() => handleChangeTab('attachment')}
                         className={`md:border hover:cursor-pointer md:h-8 flex justify-center items-center  h-full w-full text-center  rounded-md ${selectedTab == 'attachment' ? 'bg-primary' : ""}`}>
                        Attachments
                    </div>
                </div>
            </div>

            <ProjectListTabContent selectedTab={selectedTab} projectId={projectId}/>
        </div>
    )
}
