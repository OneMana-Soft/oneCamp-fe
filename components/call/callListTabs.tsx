"use client"


import {Video} from "lucide-react";
import {ChannelListTabContent} from "@/components/channel/channelListTabContent";
import {useState} from "react";
import {useMedia} from "@/context/MediaQueryContext";

export function CallListTabs() {

    const [selectedTab, setSelectedTab] = useState("forMe");

    const handleChangeTab = (t: string) => {
        setSelectedTab(t);
    }

    const {isDesktop} = useMedia()

    return (
        <div className='flex flex-col'>

            <div
                className='h-10 md:h-16 text-sm  flex w-full md:w-[20vw]  border-b justify-bet items-center p-1.5 space-x-3 md:p-4 md:ml-2'>
                {isDesktop && <div className='flex space-x-3 justify-center items-center mr-6'>
                    <div className='bg-green-500 flex justify-center items-center rounded-md w-8 p-1'><Video
                        className="h-6 w-6" fill={'white'} stroke={'white'}/></div>

                    <div className="text-base">Calls</div>
                </div>}

                <div onClick={() => handleChangeTab('forMe')}
                     className={`hover:cursor-pointer md:h-8 flex justify-center items-center  h-full w-full text-center rounded-md  ${selectedTab == 'forMe' ? 'bg-primary/10' : ""}`}>
                    For me
                </div>
                <div onClick={() => handleChangeTab('joined')}
                     className={`hover:cursor-pointer md:h-8 flex justify-center items-center  h-full w-full text-center  rounded-md ${selectedTab == 'joined' ? 'bg-primary/10' : ""}`}>
                    Joined
                </div>
            </div>

            <ChannelListTabContent selectedTab={selectedTab}/>

        </div>
    )
}
