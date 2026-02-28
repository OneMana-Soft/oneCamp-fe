"use client"

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import * as React from "react";
import MemberInfo from "@/components/member/memberInfo";
import {UserProfileDataInterface, UserProfileInterface} from "@/types/user";
import { Search } from "lucide-react";
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

import { useDebounce } from "@/hooks/useDebounce";

const MembersList: React.FC<MembersListPropInterface> = ({isAdmin, blockExitForUUID, usersList, handleMakeAdmin, handleRemoveAdmin, handleRemoveMember}) => {

    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 300)

    let foundSelf = false

    const filteredProject = React.useMemo(() => {
        return debouncedQuery === ''
            ? usersList
            : usersList.filter((member) =>
                member.user_name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(debouncedQuery.toLowerCase().replace(/\s+/g, ''))
            ) || []
    }, [debouncedQuery, usersList])

    return (
        <div className="flex flex-col h-full">
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search members..."
                    className="pl-9 bg-muted/50 border-border/50 focus-visible:ring-primary/20"
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredProject?.length === 0 && query !== '' ? (
                    <div className="text-center py-8 text-muted-foreground text-sm italic">
                        No members found.
                    </div>
                ) : (filteredProject.map((user) => {
                    let s = false
                    if(!foundSelf){
                        if( blockExitForUUID == user.user_uuid) {
                            foundSelf = true
                            s = true
                        }
                    }

                    return (
                        <div key={user.user_uuid} className="group transition-all duration-200">
                            <MemberInfo 
                                userInfo={user} 
                                isAdmin={isAdmin} 
                                handleRemoveMember={handleRemoveMember} 
                                handleMakeAdmin={handleMakeAdmin} 
                                handleRemoveAdmin={handleRemoveAdmin} 
                                blockedUUID={s}
                            />
                        </div>
                    )
                }))}
            </div>
        </div>
    );
};

export default MembersList;
