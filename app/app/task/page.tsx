"use client";

import {useRouter} from "next/navigation";
import {useMedia} from "@/context/MediaQueryContext";
import {useEffect} from "react";
import {app_channel_path} from "@/types/paths";
import {MobileHome} from "@/components/home/mobile/mobileHome";
import {LoaderCircle} from "lucide-react";
import {MobileMyTask} from "@/components/myTask/mobileMyTask";

export default function Task() {
    const router = useRouter();
    const { isDesktop, isMobile } = useMedia();

    // useEffect(() => {
    //     if (isDesktop) {
    //         router.push(app_channel_path);
    //     }
    // }, [isDesktop, router]);

    if(isMobile) {
        return <MobileMyTask/>
    }


    return (
        <div className='h-full w-full flex items-center justify-center'>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
        </div>
    );
}