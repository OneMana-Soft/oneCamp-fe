"use client"

import {TeamList} from "@/components/team/TeamList";
import {useMedia} from "@/context/MediaQueryContext";

function TeamHomePage() {

    const { isMobile, isDesktop } = useMedia();

    return (
        <>
            {isMobile && <TeamList/>}
        </>
    )
}

export default TeamHomePage;