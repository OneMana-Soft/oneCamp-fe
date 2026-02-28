"use client"

import DesktopNavigationSearch from "@/components/navigationBar/desktop/desktopNavigationSearch";
import {ThemeToggle} from "@/components/themeProvider/theme-toggle";
import {UserStatusNav} from "@/components/navigationBar/userStatusNav";
import DesktopNavigationUserProfile from "@/components/navigationBar/desktop/desktopNavigationUserProfile";
import DesktopNavigationOrgProfile from "@/components/navigationBar/desktop/desktopNavigationOrgProfile";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserProfileInterface} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";
import { ConnectionStatusIndicator } from "@/components/mqtt/ConnectionStatusIndicator";

export default function DesktopNavigationTopBar() {

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    return (
        <div className="w-full h-16 flex p-4 justify-between items-center glass sticky top-0 z-50">
            <DesktopNavigationOrgProfile/>
            <DesktopNavigationSearch/>
            <div className='flex space-x-6 justify-center items-center'>
                <ConnectionStatusIndicator />
                <UserStatusNav userUUID={selfProfile.data?.data.user_uuid || ''}/>
                <DesktopNavigationUserProfile/>
                <ThemeToggle/>
            </div>


        </div>
    )
}

