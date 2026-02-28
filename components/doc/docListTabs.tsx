"use client";

import {FileIcon} from "lucide-react";
import {useCallback, useEffect, useState} from "react";
import {useMedia} from "@/context/MediaQueryContext";
import {DocListTabContent} from "@/components/doc/docListTabContent";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

const VALID_TABS = ["private", "public"] as const
type TabValue = (typeof VALID_TABS)[number]

export function DocListTabs() {

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const [selectedTab, setSelectedTab] = useState<TabValue>(() => {
        const tabFromUrl = searchParams.get("tab")
        return VALID_TABS.includes(tabFromUrl as TabValue) ? (tabFromUrl as TabValue) : "private"
    })

    const handleChangeTab = useCallback((value: string) => {
        if (VALID_TABS.includes(value as TabValue)) {
            setSelectedTab(value as TabValue)
        }
    }, [])

    useEffect(() => {
        if (pathname === "/app/doc" && searchParams.get("tab") !== selectedTab) {
            const params = new URLSearchParams(searchParams.toString())
            params.set("tab", selectedTab)
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }
    }, [selectedTab, pathname, router, searchParams])

    const {isDesktop} = useMedia()

    return (
        <div className='flex flex-col h-full'>
            <div className='border-b-1'>


                <div
                    className='h-10 md:h-16 text-sm  flex w-full md:w-[40vw] md:justify-start justify-around items-center p-1.5 space-x-3 md:p-4 md:ml-2'>
                    {isDesktop && <div className='flex space-x-2 justify-center items-center mr-6'>
                        <div className='bg-blue-500 flex justify-center items-center  rounded-md w-8  p-1'><FileIcon
                            className="h-6 w-6" stroke={'white'}/></div>
                        <div className="text-base">Docs</div>
                    </div>}

                    <div onClick={() => handleChangeTab('private')}
                         className={`hover:cursor-pointer md:h-8 flex justify-center items-center  md:w-fit md:px-8  h-full w-full text-center  rounded-md transition-all duration-200 hover:bg-muted/50 ${selectedTab == 'private' ? 'bg-primary font-medium text-amber-50 shadow-sm' : "text-muted-foreground"}`}>
                        Private
                    </div>
                    <div onClick={() => handleChangeTab('public')}
                         className={`hover:cursor-pointer md:h-8 flex justify-center items-center  md:w-fit md:px-8  h-full w-full text-center  rounded-md transition-all duration-200 hover:bg-muted/50 ${selectedTab == 'public' ? 'bg-primary font-medium text-amber-50 shadow-sm' : "text-muted-foreground"}`}>
                        Public
                    </div>

                </div>

            </div>

            <DocListTabContent selectedTab={selectedTab} />
        </div>
    )
}
