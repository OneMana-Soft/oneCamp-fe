import {Bell, LucideIcon} from "lucide-react";
import * as React from "react";
import {Card, CardContent} from "@/components/ui/card";

interface ActionCardPropInterface {
    onLinkClick: () => void
    Icon: LucideIcon
    linkText: string

}

export const DrawerDestructiveActionLink = ({onLinkClick, Icon, linkText}: ActionCardPropInterface) => {

    return (
        <div
            className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-destructive/10 text-destructive rounded-xl px-4 mt-2'
            onClick={onLinkClick}
        >
            <Icon className='h-5 w-5'/>
            <span className='text-base font-medium'>{linkText}</span>
        </div>
    )
}