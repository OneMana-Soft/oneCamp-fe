"use client"

import {useEffect, useState} from "react";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {cn} from "@/lib/utils/cn";
import {DesktopChildrenNavType, DesktopNavType} from "@/types/nav";
import {CircleCheck, ClipboardList, Home, Users, Hash, Shield, Dot, MessageCircle} from "lucide-react";
import {DesktopSideNavigationBar} from "@/components/navigationBar/desktop/desktopSideNavigationBar";
import DesktopNavigationTopBar from "@/components/navigationBar/desktop/desktopNavigationTopBar";
import {useFetch} from "@/hooks/useFetch";
import {UserDMInterface, UserProfileDataInterface, UserProfileInterface} from "@/types/user";
import {app_channel_path, app_chat_path, app_project_path, app_project_team, app_task_path} from "@/types/paths";
import {GetEndpointUrl} from "@/services/endPoints";
import {useDispatch, useSelector} from "react-redux";
import {
    openCreateChannelDialog,
    openCreateChatMessageDialog,
    openCreateProjectDialog,
    openCreateTeamDialog
} from "@/store/slice/dialogSlice";
import {usePathname} from "next/navigation";
import {getOtherUserId} from "@/lib/utils/getOtherUserId";
import type {RootState} from "@/store/store";
import {
    createUserChannelList,
    createUserChatList,
    createUserProjectList,
    createUserTeamList, updateUsersStatusFromList
} from "@/store/slice/userSlice";
import {sortChannelList} from "@/lib/utils/sortChannelList";
import {sortChatList} from "@/lib/utils/sortChatList";


export function DesktopNavigationBar({
                                        children,
                                    }: Readonly<{
    children: React.ReactNode;
}>) {

    const dispatch = useDispatch();

    const path = usePathname().split('/')
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [panelSizes, setPanelSizes] = useState([16, 84]); // Default sizes

    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [isTeamOpen, setIsTeamOpen] = useState(false);
    const [isChannelOpen, setIsChannelOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const userSideNav = useFetch<UserProfileInterface>(GetEndpointUrl.SelfProfileSideNav)

    const userSidebarState = useSelector((state: RootState) => state.users.userSidebar)


    const projectNavGrp = [] as DesktopChildrenNavType[]
    const teamNavGrp = [] as DesktopChildrenNavType[]
    const channelNavGrp = [] as DesktopChildrenNavType[]
    const dmNavGrp = [] as DesktopChildrenNavType[]


    useEffect(() => {
        if(userSideNav.data?.data.user_teams) {
            dispatch(createUserTeamList({teamUsers: userSideNav.data?.data.user_teams}))
        }

        if(userSideNav.data?.data.user_projects) {
            dispatch(createUserProjectList({projectUsers: userSideNav.data?.data.user_projects}))
        }

        if(userSideNav.data?.data.user_channels) {
            dispatch(createUserChannelList({channelsUser: userSideNav.data.data.user_channels}))
        }

        if (userSideNav.data?.data.user_dms) {
            const otherUsersList = userSideNav.data.data.user_dms.reduce<UserProfileDataInterface[]>((acc, dm) => {
                const originalUser = dm.dm_chats?.[0]?.chat_to || dm.dm_chats?.[0]?.chat_from || userSideNav.data?.data || {} as UserProfileDataInterface;

                // Create a new object instead of mutating the original
                const otherUser = {
                    ...originalUser,
                    user_dms: [JSON.parse(JSON.stringify(dm))]
                };

                return [...acc, otherUser];
            }, []);



            dispatch(createUserChatList({ chatUsers: otherUsersList }));
            dispatch(updateUsersStatusFromList({ users: otherUsersList }));
        }

    }, [userSideNav.data?.data]);

    const navCollapsedSize = 4;

    const navLinks:DesktopNavType[] = [
        {
            title: 'Home',
            label: "",
            icon: Home,
            variant: (path.length > 2 && path[2] == 'channel') ? "default" : "ghost",
            path: app_channel_path,
        },
        {
            title: 'My Tasks',
            label: "",
            icon: CircleCheck,
            variant: (path.length > 2 && path[2] == 'task') ? "default" : "ghost",
            path: app_task_path,
        },
        {
            title: "DMs",
            label: "",
            icon: MessageCircle,
            variant: (path.length > 2 && path[2] == 'chat') ? "default" : "ghost",
            path: app_chat_path,
        }
    ];


    const isAdmin = userSideNav.data && userSideNav.data.data.user_is_admin
    if(isAdmin) {
        navLinks.push({
            title: 'Admin',
            label: "",
            icon: Shield,
            variant: "ghost",
            path: "app/admin",
        })
    }

    for (const p of userSidebarState.userProjects||[]) {
        // variant: path[2] && path[2]==p.project_uuid? "default" : "ghost",
        projectNavGrp.push({
            title: p.project_name,
            path: `${app_project_path}/${p.project_uuid}`,
            variant:(path.length > 3 && path[3] == p.project_uuid) ? "default" : "ghost",
        })
    }

    for (const t of userSidebarState.userTeams||[]) {
        // variant: path[2] && path[2]==p.project_uuid? "default" : "ghost",
        teamNavGrp.push({
            title: t.team_name,
            path: `${app_project_team}/${t.team_uuid}`,
            variant: (path.length > 3 && path[3] == t.team_uuid) ? "default" : "ghost",
        })
    }

    for (const c of sortChannelList(userSidebarState.userChannels||[])) {
        // variant: path[2] && path[2]==p.project_uuid? "default" : "ghost",
        channelNavGrp.push({
            title: c.ch_name,
            unread_count: c?.unread_post_count,
            path: `${app_channel_path}/${c.ch_uuid}`,
            variant: (path.length > 3 && path[3] == c.ch_uuid) ? "default" : "ghost",
        })
    }


    for (const d of sortChatList(userSidebarState.userChats||[])) {
        dmNavGrp.push({
            title: d.user_name,
            userProfile: d,
            unread_count: d?.user_dms?.[0]?.dm_unread,
            path: `${app_chat_path}/${d.user_uuid}`,
            variant: (path.length > 3 && path[3] == d.user_uuid) ? "default" : "ghost",
        })
    }

    const secondaryNavLinks:DesktopNavType[] = [
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
        {
            title: 'teams',
            label: "342",
            icon: Users,
            variant: "ghost",
            path: "#",
            action: isAdmin ? ()=>{dispatch(openCreateTeamDialog())} : undefined,
            isOpen: isTeamOpen,
            setIsOpen: setIsTeamOpen,
            children: teamNavGrp
        },
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

    useEffect(() => {
        // Read the layout cookie
        const layoutCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('react-resizable-root-panels:layout:mail='));
        if (layoutCookie) {
            const layoutSizes = JSON.parse(layoutCookie.split('=')[1]);
            setPanelSizes(layoutSizes);
        }

        // Read the collapsed state cookie
        const collapsedCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('react-resizable-root-panels:collapsed='));
        if (collapsedCookie) {
            const isCollapsed = JSON.parse(collapsedCookie.split('=')[1]);
            setIsCollapsed(isCollapsed);
        }
    }, []);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <DesktopNavigationTopBar />
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup
                    direction="horizontal"
                    onLayout={(sizes) => {
                        document.cookie = `react-resizable-root-panels:layout:mail=${JSON.stringify(sizes)}`
                    }}
                    className="h-full"
                >
                    <ResizablePanel
                        defaultSize={panelSizes[0]}
                        collapsedSize={navCollapsedSize}
                        collapsible={true}
                        minSize={15}
                        maxSize={18}
                        onCollapse={() => {
                            setIsCollapsed(true)
                            document.cookie = `react-resizable-root-panels:collapsed=${JSON.stringify(true)}`
                        }}
                        onExpand={() => {
                            setIsCollapsed(false)
                            document.cookie = `react-resizable-root-panels:collapsed=${JSON.stringify(false)}`
                        }}
                        className={cn("flex flex-col overflow-hidden", isCollapsed && "min-w-[0.5rem] transition-all duration-300 ease-in-out")}
                    >
                            <DesktopSideNavigationBar isCollapsed={isCollapsed} links={navLinks} />
                            <div className='flex-1 border-t-2  overflow-y-scroll'>
                                <DesktopSideNavigationBar isCollapsed={isCollapsed} links={secondaryNavLinks} />
                            </div>

                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={panelSizes[1]} minSize={20} className="overflow-y-auto">
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>


    );
}