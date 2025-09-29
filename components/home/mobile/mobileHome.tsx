"use client"

import {MobileHomeSearchBar} from "@/components/home/mobile/mobileHomeSearchBar";
import {ClipboardList, FileIcon, FileText, Hash, MessageCircle, Users, Video} from "lucide-react";
import {DesktopChildrenNavType, DesktopNavType} from "@/types/nav";
import {useEffect, useState} from "react";
import {DesktopSideNavigationBar} from "@/components/navigationBar/desktop/desktopSideNavigationBar";
import {Separator} from "@/components/ui/separator";
import {app_channel_path, app_chat_path, app_project_path, app_project_team} from "@/types/paths";
import {useFetch} from "@/hooks/useFetch";
import {UserProfileDataInterface, UserProfileInterface} from "@/types/user";
import {useDispatch, useSelector} from "react-redux";
import {
    openCreateChannelDialog,
    openCreateChatMessageDialog,
    openCreateProjectDialog,
    openCreateTeamDialog
} from "@/store/slice/dialogSlice";
import {GetEndpointUrl} from "@/services/endPoints";
import {
    createUserChannelList,
    createUserChatList,
    createUserProjectList,
    createUserTeamList, updateUsersStatusFromList
} from "@/store/slice/userSlice";
import type {RootState} from "@/store/store";

export function MobileHome() {

    const dispatch = useDispatch();

    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [isTeamOpen, setIsTeamOpen] = useState(false);
    const [isChannelOpen, setIsChannelOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const projectNavGrp = [] as DesktopChildrenNavType[]
    const teamNavGrp = [] as DesktopChildrenNavType[]
    const channelNavGrp = [] as DesktopChildrenNavType[]
    const dmNavGrp = [] as DesktopChildrenNavType[]


    const userSideNav = useFetch<UserProfileInterface>(GetEndpointUrl.SelfProfileSideNav)
    const userSidebarState = useSelector((state: RootState) => state.users.userSidebar)


    useEffect(() => {
        if(userSideNav.data?.data.user_teams) {
            dispatch(createUserTeamList({teamUsers: userSideNav.data?.data.user_teams}))
        }

        if(userSideNav.data?.data.user_projects) {
            dispatch(createUserProjectList({projectUsers: userSideNav.data?.data.user_projects}))
        }

        if(userSideNav.data?.data.user_channels) {
            dispatch(createUserChannelList({channelsUser: userSideNav.data?.data.user_channels}))
        }

        if(userSideNav.data?.data.user_dms) {
            const otherUsersList = userSideNav.data.data.user_dms.reduce<UserProfileDataInterface[]>((acc, dm) => {
                const originalUser = dm.dm_chats?.[0]?.chat_to || dm.dm_chats?.[0]?.chat_from || userSideNav.data?.data || {} as UserProfileDataInterface;

                // Create a new object instead of mutating the original
                const otherUser = {
                    ...originalUser,
                    user_dms: [JSON.parse(JSON.stringify(dm))]
                };

                return [...acc, otherUser];
            }, []);


            dispatch(createUserChatList({chatUsers: otherUsersList}))

            console.log("dsasdfs sadd", otherUsersList)

            dispatch(updateUsersStatusFromList({users: otherUsersList}))

        }

    }, [userSideNav.data?.data]);

    for (const p of userSidebarState.userProjects||[]) {
        // variant: path[2] && path[2]==p.project_uuid? "default" : "ghost",
        projectNavGrp.push({
            title: p.project_name,
            path: `${app_project_path}/${p.project_uuid}`,
            variant: "ghost"
        })
    }

    for (const t of userSidebarState.userTeams||[]) {
        // variant: path[2] && path[2]==p.project_uuid? "default" : "ghost",
        teamNavGrp.push({
            title: t.team_name,
            path: `${app_project_team}/${t.team_uuid}`,
            variant: "ghost"
        })
    }

    for (const c of userSidebarState.userChannels||[]) {
        // variant: path[2] && path[2]==p.project_uuid? "default" : "ghost",
        channelNavGrp.push({
            title: c.ch_name,
            path: `${app_channel_path}/${c.ch_uuid}`,
            variant: "ghost"
        })
    }

    for (const d of userSidebarState.userChats||[]) {
        // variant: path[2] && path[2]==p.project_uuid? "default" : "ghost",
        dmNavGrp.push({
            title: d.user_name,
            userProfile: d,
            path: `${app_chat_path}/${d.user_uuid}`,
            variant: "ghost",
        })
    }

    const secondaryNavLinks1:DesktopNavType[] = [
        {
            title: 'projects',
            label: "972",
            icon: ClipboardList,
            variant: "ghost",
            path: "#",
            action: ()=>{dispatch(openCreateProjectDialog())},
            isOpen: isProjectOpen,
            setIsOpen: setIsProjectOpen,
            children: projectNavGrp
        },
    ];

    const secondaryNavLinks2:DesktopNavType[] = [

        {
            title: 'teams',
            label: "342",
            icon: Users,
            variant: "ghost",
            path: "#",
            action: ()=>{dispatch(openCreateTeamDialog())},
            isOpen: isTeamOpen,
            setIsOpen: setIsTeamOpen,
            children: teamNavGrp
        }
    ];

    const secondaryNavLinks3:DesktopNavType[] = [

        {
            title: 'channels',
            label: "342",
            icon: Hash,
            variant: "ghost",
            path: "#",
            action: ()=>{dispatch(openCreateChannelDialog())},
            isOpen: isChannelOpen,
            setIsOpen: setIsChannelOpen,
            children: channelNavGrp
        },
    ];

    const secondaryNavLinks4:DesktopNavType[] = [

        {
            title: 'chats',
            label: "342",
            icon: MessageCircle,
            variant: "ghost",
            path: "#",
            action: ()=>{dispatch(openCreateChatMessageDialog())},
            isOpen: isChatOpen,
            setIsOpen: setIsChatOpen,
            children: dmNavGrp
        },
    ];

    return (
        <div className='flex flex-col space-y-4 justify-center mt-6 pl-4 pr-4'>
            <MobileHomeSearchBar/>
            <div className='flex justify-between'>
                <div className='h-[9vh] w-[29vw] bg-secondary rounded-2xl flex flex-col justify-center p-4'>
                    <div className='bg-gray-500 flex justify-center items-center mb-2 rounded-md w-6 p-1'><FileText className="h-4 w-4" stroke={'white'}/></div>
                        <span>Posts</span>

                    </div>
                    <div className='h-[9vh] w-[29vw]  bg-secondary rounded-2xl flex flex-col justify-center p-4'>
                    <div className='bg-blue-500 flex justify-center items-center mb-2 rounded-md w-6  p-1'><FileIcon className="h-4 w-4" stroke={'white'}/></div>
                        <span >Docs</span>

                    </div>
                    <div className='h-[9vh] w-[29vw] bg-secondary rounded-2xl flex flex-col justify-center p-4'>

                    <div className='bg-green-500 flex justify-center items-center mb-2 rounded-md w-6 p-1'><Video className="h-4 w-4" fill={'white'} stroke={'white'}/></div>
                    <span>Calls</span>

                </div>
            </div>

            <div className='flex flex-col overflow-y-scroll h-full'>
                <DesktopSideNavigationBar isCollapsed={false} links={secondaryNavLinks1} />
                <Separator />
                <DesktopSideNavigationBar isCollapsed={false} links={secondaryNavLinks2} />
                <Separator />
                <DesktopSideNavigationBar isCollapsed={false} links={secondaryNavLinks3} />
                <Separator />
                <DesktopSideNavigationBar isCollapsed={false} links={secondaryNavLinks4} />
                <Separator />


            </div>


        </div>
    );
}