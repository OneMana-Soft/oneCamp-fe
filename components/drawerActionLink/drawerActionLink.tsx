import {Bell, LucideIcon} from "lucide-react";
import * as React from "react";
import {Card, CardContent} from "@/components/ui/card";

interface ActionCardPropInterface {
    onLinkClick: () => void
    Icon: LucideIcon
    linkText: string

}

export const DrawerActionLink = ({onLinkClick, Icon, linkText}: ActionCardPropInterface) => {

    return (
        <div
            className='w-full h-14 flex space-x-4 items-center cursor-pointer transition-colors hover:bg-muted/50 rounded-xl px-4'
            onClick={onLinkClick}
        >
            <Icon className='h-5 w-5 text-muted-foreground'/>
            <span className='text-base font-medium'>{linkText}</span>
        </div>
    )
}