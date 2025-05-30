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
            className='w-full h-12 flex space-x-3 items-center '
            onClick={onLinkClick}
        >
            <Icon className='h-5 w-5'/>
            <span className='text-sm'>{linkText}</span>
        </div>
    )
}