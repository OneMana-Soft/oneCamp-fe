"use client";

import {useMedia} from "@/context/MediaQueryContext";
import {MyTaskDesktop} from "@/components/myTask/myTaskDesktop";
import {MyTaskMobile} from "@/components/myTask/myTaskMobile";

export default function Task() {
    const { isDesktop, isMobile } = useMedia();

    // useEffect(() => {
    //     if (isDesktop) {
    //         router.push(app_channel_path);
    //     }
    // }, [isDesktop, router]);



    return (
        <>
            {isMobile && <MyTaskMobile/>}
            {isDesktop && <MyTaskDesktop/>}
        </>
    );
}