import {prioritiesInterface} from "@/types/table";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils/helpers/cn";
import {Button} from "@/components/ui/button";

export const TaskStatusCell = ({status}: {status: prioritiesInterface}) => {


    return (
        <div
            className={cn(
                "flex items-center rounded-full px-2 py-1  bg-blue-700 text-xs font-medium  space-x-1",
                status.color,
            )}
        >            {status.icon && (
                <status.icon className=" h-4 w-4 text-muted-foreground" />
            )}
            <div>{(status.value)}</div>
        </div>
    )
}