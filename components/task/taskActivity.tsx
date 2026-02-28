import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/format/getNameIntials";
import {taskActivityConst} from "@/types/taskActivity";
import {TaskActivityInterface} from "@/types/task";
import {formatTimeForPostOrComment} from "@/lib/utils/date/formatTimeForPostOrComment";
import {useTranslation} from "react-i18next";

interface  TaskActivityProps {
    taskActivity: TaskActivityInterface
    openOtherUserProfile: (id: string) => void
}

export default function TaskActivity({taskActivity, openOtherUserProfile}: TaskActivityProps) {

    const profileImageRes = useMediaFetch<GetMediaURLRes>(taskActivity.activity_by.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL+'/'+taskActivity.activity_by.user_profile_object_key : '');
    const nameInitial = getNameInitials(taskActivity.activity_by.user_name||'');


    const {t} = useTranslation()



    return (


        <div className="flex items-start gap-2 relative">
            <div className="relative">
                <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={profileImageRes.data?.url || ''} alt="@shadcn" />
                    <AvatarFallback>{nameInitial}</AvatarFallback>
                </Avatar>{" "}
            </div>
            <div className="flex-1 pt-2">
                <p className="text-sm ">
                    <span className="font-medium hover:underline cursor-pointer" onClick={()=>{openOtherUserProfile(taskActivity.activity_by.user_uuid)}}>{taskActivity.activity_by.user_name}</span>{" "}
                    {t(taskActivityConst[taskActivity.activity_type].key)}.{" "}
                    <span className="text-muted-foreground">{formatTimeForPostOrComment(taskActivity.activity_time)}</span>
                </p>
            </div>
        </div>


    )
}

