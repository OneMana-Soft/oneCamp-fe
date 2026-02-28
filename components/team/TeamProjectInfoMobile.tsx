import {useLongPress} from "@/hooks/useLongPress";
import {isZeroEpoch} from "@/lib/utils/validation/isZeroEpoch";
import {ProjectInfoInterface} from "@/types/project";
import {Badge} from "@/components/ui/badge";
import {ColorIcon} from "@/components/colorIcon/colorIcon";
import {openUI} from "@/store/slice/uiSlice";
import {useDispatch} from "react-redux";
import {Separator} from "@/components/ui/separator";
import * as React from "react";
import {useMedia} from "@/context/MediaQueryContext";

export const TeamProjectInfoMobile = ({projectInfo, isAdmin, teamId, isUsersProject}: {projectInfo: ProjectInfoInterface, isAdmin: boolean, teamId: string, isUsersProject: boolean})=>{

    const {isDesktop} = useMedia()
    const dispatch= useDispatch();

    const onLongPress = () => {

        if(isDesktop) return

        if(!isAdmin && !projectInfo.project_is_member && !isUsersProject) return

        dispatch(openUI({
            key: 'projectLongPress',
            data: {
                isAdmin: isAdmin,
                projectId: projectInfo.project_uuid,
                teamId: teamId || projectInfo.project_team.team_uuid,
                isMember: projectInfo.project_is_member || isUsersProject,
                isDeleted: !isZeroEpoch(projectInfo.project_deleted_at),
            }
        }));
    }

    const longPressEvent = useLongPress(onLongPress, {
        threshold: 500, // Reduced from 800ms to 500ms for quicker long press
    })

    return (
        <div className='flex  px-2 select-none' {...longPressEvent} >

            <div className='flex justify-between w-full h-16 items-center '>
                <div className='flex items-center space-x-2'>

                        <ColorIcon name={projectInfo.project_uuid} size={'sm'}/>

                    <div className="flex items-center gap-2 max-w-sm overflow-hidden">
                        <div
                            className={`whitespace-nowrap overflow-ellipsis overflow-hidden ${projectInfo.project_is_member ? "hover:underline cursor-pointer" : ""}`}>
                            {projectInfo.project_name}
                        </div>
                        {projectInfo.project_is_member && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-emerald-500/30 bg-emerald-500/5 text-emerald-600 font-medium">
                                Member
                            </Badge>
                        )}
                    </div>
                </div>

                <div className='flex items-center space-x-3.5'>

                    <div>
                        {
                            isAdmin && (isZeroEpoch(projectInfo.project_deleted_at || '') ?
                                    <Badge variant="secondary" className='text-white bg-emerald-500'>Active</Badge>
                                :
                                <Badge variant="outline" className='text-white bg-destructive'>Archived</Badge>

                            )
                        }
                        {
                            projectInfo.project_team &&
                            <div className='text-sm text-muted-foreground'>
                                {projectInfo.project_team.team_name}
                            </div>
                        }
                    </div>

                </div>

            </div>
        </div>
    )
}
