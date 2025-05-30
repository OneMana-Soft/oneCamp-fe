"use client";

import { useRef, useEffect } from "react";
import { useMedia } from "@/context/MediaQueryContext";
import { MobileTextInput } from "@/components/textInput/mobileTextInput";
import { ChannelIdDesktop } from "@/components/channel/chanelIdDesktop";
import {usePathname} from "next/navigation";
import {ChannelIdMobile} from "@/components/channel/channelIdMobile";


function Channel() {


    const channelId = usePathname().split('/')[3]

    const { isMobile, isDesktop } = useMedia();

    return (
        <>

            {isMobile && <ChannelIdMobile channelId={channelId} />}

            {isDesktop && <ChannelIdDesktop channelId={channelId} />}
        </>
    );
}

export default Channel;
