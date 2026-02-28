import {NotificationType} from "@/types/channel";
import {AtSign, Bell, BellOff, LoaderCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {useMedia} from "@/context/MediaQueryContext";

export const NotificationBell = ({notificationType, isLoading, onNotCLick}: {notificationType: string, isLoading: boolean, onNotCLick: ()=>void}) => {

    const { isMobile, isDesktop } = useMedia()

    if(!notificationType) return


    const notificationIconRender = () => {

        if(isLoading) return <LoaderCircle className="h-4 w-4 animate-spin"/>

        switch(notificationType) {

            case NotificationType.NotificationAll:
                return (<Bell className="h-5 w-5"/>)

            case NotificationType.NotificationBlock:
                return (<BellOff className="h-5 w-5"/>)


            case NotificationType.NotificationMention:
                return (<div className='relative flex'><Bell className="h-5 w-5"/><span
                    className="text-sm md:text-xs m-1 -mt-1 -right-2 top-0 absolute bg-background rounded-full">@</span>
                </div>)

        }
    }

    return (
        <>
            {isDesktop && <Button variant='ghost' size='icon' className={'group'} disabled={isLoading} onClick={onNotCLick}>{notificationIconRender()}</Button>}
            {isMobile && <div className="p-2" onClick={onNotCLick}>{notificationIconRender()}</div>}

        </>
    )

}