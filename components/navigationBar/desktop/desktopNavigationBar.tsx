"use client"

import {useEffect, useState} from "react";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {cn} from "@/lib/utils/cn";
import {DesktopChildrenNavType, DesktopNavType} from "@/types/nav";
import {CircleCheck, ClipboardList, Home, Users, Hash, Shield} from "lucide-react";
import {DesktopSideNavigationBar} from "@/components/navigationBar/desktop/desktopSideNavigationBar";
import DesktopNavigationTopBar from "@/components/navigationBar/desktop/desktopNavigationTopBar";
import {useFetch} from "@/hooks/useFetch";
import {UserProfileInterface} from "@/types/user";
import {app_channel_path, app_project_path, app_project_team} from "@/types/paths";
import {GetEndpointUrl} from "@/services/endPoints";
import {useDispatch} from "react-redux";
import {openCreateChannelDialog, openCreateProjectDialog, openCreateTeamDialog} from "@/store/slice/dialogSlice";
import {usePathname} from "next/navigation";


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

    const projectNavGrp = [] as DesktopChildrenNavType[]
    const teamNavGrp = [] as DesktopChildrenNavType[]
    const channelNavGrp = [] as DesktopChildrenNavType[]


    const navCollapsedSize = 4;

    const navLinks:DesktopNavType[] = [
        {
            title: 'Home',
            label: "",
            icon: Home,
            variant: (path.length > 2 && path[2] == 'channel') ? "default" : "ghost",
            path: "app/channel",
        },
        {
            title: 'My Tasks',
            label: "",
            icon: CircleCheck,
            variant: (path.length > 2 && path[2] == 'task') ? "default" : "ghost",
            path: "app/task",
        }
    ];

    const userSideNav = useFetch<UserProfileInterface>(GetEndpointUrl.SelfProfileSideNav)

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

    for (const p of userSideNav.data?.data.user_projects||[]) {
        // variant: path[2] && path[2]==p.project_uuid? "default" : "ghost",
        projectNavGrp.push({
            title: p.project_name,
            path: `${app_project_path}/${p.project_uuid}`,
            variant:(path.length > 3 && path[3] == p.project_uuid) ? "default" : "ghost",
        })
    }

    for (const t of userSideNav.data?.data.user_teams||[]) {
        // variant: path[2] && path[2]==p.project_uuid? "default" : "ghost",
        teamNavGrp.push({
            title: t.team_name,
            path: `${app_project_team}/${t.team_uuid}`,
            variant: (path.length > 3 && path[3] == t.team_uuid) ? "default" : "ghost",
        })
    }

    for (const c of userSideNav.data?.data.user_channels||[]) {
        // variant: path[2] && path[2]==p.project_uuid? "default" : "ghost",
        channelNavGrp.push({
            title: c.ch_name,
            path: `${app_channel_path}/${c.ch_uuid}`,
            variant: (path.length > 3 && path[3] == c.ch_uuid) ? "default" : "ghost",
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