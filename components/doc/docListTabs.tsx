"use client";

import {FileIcon} from "lucide-react";
import {ChannelListTabContent} from "@/components/channel/channelListTabContent";
import {useState} from "react";
import {useMedia} from "@/context/MediaQueryContext";

export function DocListTabs() {

    const [selectedTab, setSelectedTab] = useState("forMe");

    const handleChangeTab = (t: string) => {
        setSelectedTab(t);
    }

    const {isDesktop} = useMedia()

    return (
        <div className='flex flex-col'>

            <div
                className='h-10 md:h-16 text-sm  flex w-full md:w-[22vw]   justify-around items-center p-1.5 space-x-3 md:p-4 md:ml-2'>
                {isDesktop && <div className='flex space-x-2 justify-center items-center text-center mr-6'>
                    <div className='bg-blue-500 flex justify-center items-center  rounded-md w-8  p-1'><FileIcon
                        className="h-6 w-6" stroke={'white'}/></div>
                    <div className="text-base">Docs</div>
                </div>}

                <div onClick={() => handleChangeTab('forMe')}
                     className={`hover:cursor-pointer md:h-8 flex justify-center items-center  h-full w-full text-center rounded-md  ${selectedTab == 'forMe' ? 'bg-primary/10' : ""}`}>
                    For me
                </div>
                <div onClick={() => handleChangeTab('created')}
                     className={`hover:cursor-pointer md:h-8 flex justify-center items-center  h-full w-full text-center  rounded-md ${selectedTab == 'created' ? 'bg-primary/10' : ""}`}>
                    Created
                </div>

                <div onClick={() => handleChangeTab('all')}
                     className={`hover:cursor-pointer md:h-8 flex justify-center items-center  h-full w-full text-center  rounded-md ${selectedTab == 'all' ? 'bg-primary/10' : ""}`}>
                    All
                </div>
            </div>

            <ChannelListTabContent/>
        </div>
    )
}
