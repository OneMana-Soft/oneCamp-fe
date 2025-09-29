"use client"


import {Circle, Hash} from "lucide-react";
import {ChannelListTabContent} from "@/components/channel/channelListTabContent";
import {useState} from "react";
import {useMedia} from "@/context/MediaQueryContext";

export function ChannelListTabs() {

    const [selectedTab, setSelectedTab] = useState("active");

    const handleChangeTab = (t: string) => {
        setSelectedTab(t);
    }

    const {isDesktop} = useMedia()

    return (
        <div className='flex flex-col h-full'>

            <div>
            <div
                className='h-10 md:h-16 text-sm  flex w-full md:w-[20vw]   justify-around items-center p-1.5 space-x-3 md:p-4 md:ml-2'>
                {isDesktop && <div className='flex space-x-1 justify-center items-center mr-6'>
                    <div><Hash className='h-5 w-5 text-muted-foreground'/></div>
                    <div className="text-base">Channels</div>
                </div>}

                <div onClick={() => handleChangeTab('active')}
                     className={`hover:cursor-pointer md:h-8 flex justify-center items-center  h-full w-full text-center rounded-md  ${selectedTab == 'active' ? 'bg-primary/10' : ""}`}>
                    Active
                </div>
                <div onClick={() => handleChangeTab('archived')}
                     className={`hover:cursor-pointer md:h-8 flex justify-center items-center  h-full w-full text-center  rounded-md ${selectedTab == 'archived' ? 'bg-primary/10' : ""}`}>
                    Archived
                </div>
            </div>
            </div>

            <ChannelListTabContent selectedTab={selectedTab}/>
        </div>
    )
}
