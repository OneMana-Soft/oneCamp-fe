import { LucideIcon} from "lucide-react";
import * as React from "react";
import {Card, CardContent} from "@/components/ui/card";

interface ActionCardPropInterface {
    onCardClick: () => void
    Icon: LucideIcon
    cardText: string

}

export const DrawerActionCard = ({onCardClick, Icon, cardText}: ActionCardPropInterface) => {

    return (
        <Card
            className="flex-1  h-20 p-4 cursor-pointer bg-secondary/80"
            onClick={onCardClick}
        >
            <CardContent
                className="text-sm flex flex-col items-center justify-center space-y-3 p-0">
                <div className="flex justify-center">
                    <Icon className="h-5 w-5"/>
                </div>
                <div className="text-xs">{cardText}</div>
            </CardContent>
        </Card>
    )
}