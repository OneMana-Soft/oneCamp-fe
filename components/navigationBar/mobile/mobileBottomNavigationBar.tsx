"use client";

import { Bell, ClipboardCheck, Home, MessageCircle, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navIcons = [
    {
        icon: Home,
        label: "Home",
        page: "app/home",
    },
    {
        icon: Users,
        label: "Channels",
        page: "app/channel",
    },
    {
        icon: MessageCircle,
        label: "Dm's",
        page: "app/chat",
    },
    {
        icon: Bell,
        label: "Notifications",
        page: "app/notification",
    },
    {
        icon: ClipboardCheck,
        label: "My Tasks",
        page: "app/task",
    },
];

export function MobileBottomNavigationBar() {
    const pathname = usePathname();
    const path = pathname.slice(1);

    const pathLength = path.split('/').length;

    if(pathLength > 2) return null;

    return (
        <div className="h-20 w-full border-grid z-40 border-t bg-primary-background/10 backdrop-blur">
            <div className="grid grid-cols-10 items-center h-full w-full">
                {navIcons.map(({ icon: Icon, label, page }) => (
                    <Link
                        key={page}
                        href={`/${page}`}
                        className={`col-span-2 flex items-center justify-center h-full ${
                            path === page ? "border-t-4" : "text-muted-foreground"
                        }`}
                    >
                        <div className="flex space-y-2 flex-col items-center">
                            <Icon />
                            <div className="text-xs">{label}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}