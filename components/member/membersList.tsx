"use client"

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import * as React from "react";
import MemberInfo from "@/components/member/memberInfo";
import {UserProfileDataInterface, UserProfileInterface} from "@/types/user";
import {useFetch} from "@/hooks/useFetch";
import {GetEndpointUrl} from "@/services/endPoints";


interface MembersListPropInterface {
    isAdmin: boolean
    usersList: UserProfileDataInterface[]
    blockExitForUUID?: string
    handleMakeAdmin: (id: string) => void
    handleRemoveAdmin: (id: string) => void
    handleRemoveMember: (id: string) => void
}

const MembersList: React.FC<MembersListPropInterface> = ({isAdmin, blockExitForUUID, usersList, handleMakeAdmin, handleRemoveAdmin, handleRemoveMember}) => {

    const [query, setQuery] = useState('')


    let foundSelf = false

    const filteredProject =
        query === ''
            ? usersList
            : usersList.filter((member) =>
            member.user_name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, ''))
        ) || [] as UserProfileDataInterface[]

    return (

        <div>

            <Input
                type="text"
                placeholder={'member search'}
                // className="w-full px-2 py-1 border-2 border-gray-300 rounded-full"
                onChange={(event) => setQuery(event.target.value)}
            />

            <div className="h-[60vh] mt-4 pl-3 pr-3 channel-members-list flex flex-col overflow-y-auto">
                {filteredProject?.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        {"No member found"}
                    </div>
                ) : (filteredProject.map((user, i) => {
                    let s = false
                    if(!foundSelf){
                        if( blockExitForUUID == user.user_uuid) {
                            foundSelf = true
                            s = true
                        }
                    }

                    return (

                        <div key={(user.user_uuid)}>
                            <Separator orientation="horizontal" className={i ? 'invisible' : ''} />
                            <MemberInfo userInfo={user} isAdmin={isAdmin} handleRemoveMember={handleRemoveMember} handleMakeAdmin={handleMakeAdmin} handleRemoveAdmin={handleRemoveAdmin} isSelf={s}/>
                            <Separator orientation="horizontal" className="" />

                        </div>
                    )
                }))}
            </div>
        </div>

    );
};

export default MembersList;
