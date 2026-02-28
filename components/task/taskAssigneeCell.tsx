import {useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/format/getNameIntials";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {UserProfileDataInterface} from "@/types/user";

export const TaskAssigneeCell = ({userInfo}: {userInfo: UserProfileDataInterface}) => {
    const profileImageRes = useMediaFetch<GetMediaURLRes>(userInfo.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL+'/'+userInfo.user_profile_object_key : '');
    const nameInitial = getNameInitials(userInfo.user_name);

    return (
        <div className='flex space-x-2 items-center justify-center max-w-3xl text-sm'>
            <Avatar className="w-6 h-6">
                <AvatarImage src={profileImageRes.data?.url} className='rounded-full'/>
                <AvatarFallback>
                    {nameInitial}
                </AvatarFallback>
            </Avatar>
            <div>
                {userInfo.user_name}
            </div>
        </div>

    )
}