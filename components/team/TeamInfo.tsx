import {ProjectInfoInterface} from "@/types/project";
import {Button} from "@/components/ui/button";
import {Trash, Users} from "lucide-react";
import {isZeroEpoch} from "@/lib/utils/validation/isZeroEpoch";
import {useRouter} from "next/navigation";
import {app_channel_path, app_project_path, app_my_task_path, app_team_path} from "@/types/paths";
import {TeamInfoInterface} from "@/types/team";
import {ColorIcon} from "@/components/colorIcon/colorIcon";

interface TeamsInfoInterface {
    teamInfo: TeamInfoInterface
}

export const TeamInfo = ({teamInfo}: TeamsInfoInterface) => {


    return (

        <div className='flex justify-between h-16 items-center px-2'>

            <div className={`max-w-sm capitalize flex justify-center space-x-2 items-center overflow-hidden whitespace-nowrap overflow-ellipsis ${teamInfo.team_is_member?"hover:underline cursor-pointer":""}`} >
                <Users className={'text-muted-foreground'} />
                <div>{teamInfo.team_name }</div>
            </div>
            <div className='flex items-center text-sm text-muted-foreground '>
                {teamInfo.team_member_count} members
            </div>
        </div>

    );
}