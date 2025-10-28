"use client";

import {useRouter} from "next/navigation";
import {useMedia} from "@/context/MediaQueryContext";
import {useEffect} from "react";
import {app_channel_path} from "@/types/paths";
import {MobileHome} from "@/components/home/mobile/mobileHome";
import {LoaderCircle} from "lucide-react";
import {MobileMyTask} from "@/components/myTask/mobileMyTask";
import {MyTaskDesktop} from "@/components/myTask/myTaskDesktop";

export default function Task() {
    const { isDesktop, isMobile } = useMedia();

    // useEffect(() => {
    //     if (isDesktop) {
    //         router.push(app_channel_path);
    //     }
    // }, [isDesktop, router]);



    return (
        <>
            {isMobile && <MobileMyTask/>}
            {isDesktop && <MyTaskDesktop/>}
        </>
    );
}