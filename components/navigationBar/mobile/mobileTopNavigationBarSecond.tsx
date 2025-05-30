"use client"

import {usePathname} from "next/navigation";
import {
    MobileTopNavigationBarSecondChannel,
} from "@/components/navigationBar/mobile/mobileTopNavigationBarSecondChannel";

export function MobileTopNavigationBarSecond() {
    const path = usePathname().split('/');


    const renderPageName = () => {
        switch (path[2]) {
            case "home":
                return "Home";
            case "channel":
                if(path.length < 4)
                return "Channels";
                if(path.length < 5)
                    return <MobileTopNavigationBarSecondChannel channelUUID={path[3]}/>
                break;
            case "task":
                if(path.length < 4)
                    return "My Tasks";
                if(path.length < 5)
                    return

            case "doc":
                if(path.length < 4)
                    return "Docs";
                break;
            case "calls":
                return "Calls"

            case "chat":
                return "Chat";


            default:
                return <></>;
        }
    };

    return (
        <div className='font-bold capitalize text-lg text-center'>
            {renderPageName()}
        </div>
    );
}