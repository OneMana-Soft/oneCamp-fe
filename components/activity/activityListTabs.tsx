"use client"


import {Circle, Hash} from "lucide-react";
import {useCallback, useEffect, useState} from "react";
import {useMedia} from "@/context/MediaQueryContext";
import {ActivityListTabContent} from "@/components/activity/activityListTabContent";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useDispatch} from "react-redux";
import {setTotalUnreadActivityCount} from "@/store/slice/userSlice";

const VALID_TABS = ["all", "mentions", "comments", "reactions"] as const
type TabValue = (typeof VALID_TABS)[number]

export function ActivityListTabs() {

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const dispatch = useDispatch()

    const [selectedTab, setSelectedTab] = useState<TabValue>(() => {
        const tabFromUrl = searchParams.get("tab")
        return VALID_TABS.includes(tabFromUrl as TabValue) ? (tabFromUrl as TabValue) : "all"
    })

    const handleChangeTab = useCallback((value: string) => {
        if (VALID_TABS.includes(value as TabValue)) {
            setSelectedTab(value as TabValue)
        }
    }, [])

    useEffect(() => {
        if (pathname === "/app/activity" && searchParams.get("tab") !== selectedTab) {
            const params = new URLSearchParams(searchParams.toString())
            params.set("tab", selectedTab)
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }
    }, [selectedTab, pathname, router, searchParams])

    useEffect(() => {
        dispatch(setTotalUnreadActivityCount({count: 0}))
    }, [dispatch])

    const {isDesktop} = useMedia()

    return (
        <div className='flex flex-col h-full'>
            <div className='border-b-1'>
                <div
                    className='h-10 md:h-16 text-sm  flex w-full md:w-[40vw]  md:justify-start justify-around items-center p-1.5 space-x-3 md:p-4 md:ml-2'>
                    {isDesktop && <div className='flex space-x-1 justify-center items-center mr-6'>
                        <div><Hash className='h-5 w-5 text-muted-foreground'/></div>
                        <div className="text-base font-medium">Activities</div>
                    </div>}

                    <div onClick={() => handleChangeTab('all')}
                         className={`hover:cursor-pointer md:h-8 flex justify-center items-center  md:w-fit md:px-8  h-full w-full text-center rounded-md transition-all duration-200 hover:bg-muted/50 ${selectedTab == 'all' ? 'bg-primary font-medium hover:text-muted-foreground text-amber-50 shadow-sm' : "text-muted-foreground"}`}>
                        All
                    </div>
                    <div onClick={() => handleChangeTab('mentions')}
                         className={`hover:cursor-pointer md:h-8 flex justify-center items-center  md:w-fit md:px-8  h-full w-full text-center  rounded-md transition-all duration-200 hover:bg-muted/50 ${selectedTab == 'mentions' ? 'bg-primary font-medium hover:text-muted-foreground text-amber-50 shadow-sm' : "text-muted-foreground"}`}>
                        Mentions
                    </div>
                    <div onClick={() => handleChangeTab('comments')}
                         className={`hover:cursor-pointer md:h-8 flex justify-center items-center  md:w-fit md:px-8  h-full w-full text-center  rounded-md transition-all duration-200 hover:bg-muted/50 ${selectedTab == 'comments' ? 'bg-primary font-medium hover:text-muted-foreground text-amber-50 shadow-sm' : "text-muted-foreground"}`}>
                        Comments
                    </div>
                    <div onClick={() => handleChangeTab('reactions')}
                         className={`hover:cursor-pointer md:h-8 flex justify-center items-center   md:w-fit md:px-8 h-full w-full text-center  rounded-md transition-all duration-200 hover:bg-muted/50 ${selectedTab == 'reactions' ? 'bg-primary font-medium hover:text-muted-foreground text-amber-50 shadow-sm' : "text-muted-foreground"}`}>
                        Reactions
                    </div>
                </div>
            </div>

            <ActivityListTabContent selectedTab={selectedTab}/>
        </div>
    )
}
