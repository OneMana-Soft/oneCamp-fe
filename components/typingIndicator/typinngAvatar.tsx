import {useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/format/getNameIntials";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface TypingAvatarProps {
    userProfileObjKey: string|undefined
    userName: string
}
export const TypingAvatar = ({userProfileObjKey, userName}: TypingAvatarProps) => {
    const profileImageRes = useMediaFetch<GetMediaURLRes>(userProfileObjKey ? GetEndpointUrl.PublicAttachmentURL+'/'+userProfileObjKey : '');
    const nameInitial = getNameInitials(userName);

    return (
        <Avatar className="w-5 h-5  border border-background">
            <AvatarImage src={profileImageRes.data?.url} className='rounded-full'/>
            <AvatarFallback className='bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 text-white md:text-sm'>
                {nameInitial}
            </AvatarFallback>
        </Avatar>
    )
}