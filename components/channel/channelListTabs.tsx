"use client"


import {Circle} from "lucide-react";
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
        <div className='flex flex-col'>

            <div
                className='h-10 md:h-16 text-sm  flex w-full md:w-[20vw]   justify-around items-center p-1.5 space-x-3 md:p-4 md:ml-2'>
                {isDesktop && <div className='flex space-x-3 justify-center items-center mr-6'>
                    <div className='relative'>
                        <Circle className='absolute top-[-6] left-[-4] text-xs'
                                style={{width: `${17}px`, height: `${17}px`}}/>
                        <Circle className='' style={{width: `${17}px`, height: `${17}px`}}/>
                    </div>
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

            <ChannelListTabContent/>
        </div>
    )
}
