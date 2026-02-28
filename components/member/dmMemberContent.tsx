"use client"
import { useFetchOnlyOnce} from "@/hooks/useFetch";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {usePost} from "@/hooks/usePost";
import {RawUserDMInterface} from "@/types/user";
import AddDmMemberCombobox from "@/components/combobox/addDmMemberCombobox";
import {cn} from "@/lib/utils/helpers/cn";
import {ChatUserListUserAvatar} from "@/components/chat/chatUserListUserAvatar";
import {Badge} from "@/components/ui/badge";
import {DmMemberUpdateInterface} from "@/types/chat";


interface memberContentProp {
    grpId: string
}

const DmMemberContent: React.FC<memberContentProp> = ({grpId}) => {
    const post = usePost()


    const dmParticipantsInfo  = useFetchOnlyOnce<RawUserDMInterface>(grpId ? `${GetEndpointUrl.GetDmGroupParticipants}/${grpId}` : '')



    const handleAddMember = (id: string) => {
        if(!id) return

        post.makeRequest<DmMemberUpdateInterface>({
            apiEndpoint: PostEndpointUrl.AddDmMember,
            payload:{grp_id: grpId, user_uuid: id},
            showToast: true
        })
            .then(()=>{
                dmParticipantsInfo.mutate()
            })
    }



    return (
        <div className='h-full flex flex-col gap-y-6'>
            <AddDmMemberCombobox handleAddMember={handleAddMember} grpId={grpId}/>
            {
                dmParticipantsInfo.data?.data.dm_participants.map((user) => {
                    return (
                        <div
                            key={user.user_uuid}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                              "bg-card hover:bg-accent border-border"
                            )}
                        >
                            <ChatUserListUserAvatar userProfileObjKey={user.user_profile_object_key} userName={user.user_name} />


                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-sm text-foreground truncate">{user.user_name}</p>

                                </div>
                                <p className="text-xs text-muted-foreground truncate mb-1">{user.user_email_id}</p>
                                <div className="flex gap-1">
                                    {user.user_job_title && <Badge variant="secondary" className="text-xs">
                                        {user.user_job_title}
                                    </Badge>}
                                    {/*<Badge variant="outline" className="text-xs">*/}
                                    {/*    {user.department}*/}
                                    {/*</Badge>*/}
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default DmMemberContent