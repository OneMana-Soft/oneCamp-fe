"use client"

import {Check, Hash, Search, User} from "lucide-react"
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints"
import {
     UserListInterfaceResp,
    UserProfileDataInterface,
} from "@/types/user"
import {FwdMsgToProfileAvatar} from "@/components/searchDropdown/fwdMsgToDropdown/fwdMsgToProfileAvatar";
import {Input} from "@/components/ui/input";
import {useMemo, useState} from "react";
import {useFetch} from "@/hooks/useFetch";
import {Badge} from "@/components/ui/badge";
import {ChatUserListUserAvatar} from "@/components/chat/chatUserListUserAvatar";

interface ForwardMessageDropdownProps {
    onSelect: (user: UserProfileDataInterface) => void
    placeholder?: string
}



export function SelectUserToMessageDropdown({
                                           onSelect,
                                           placeholder = "Search users...",
                                       }: ForwardMessageDropdownProps) {

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<UserProfileDataInterface| null>(null)

    const usersList = useFetch<UserListInterfaceResp>(GetEndpointUrl.GetAllUser)

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim() && usersList.data?.users) return usersList.data.users

        if(!usersList.data?.users) return []

        const query = searchQuery.toLowerCase()
        return usersList.data?.users.filter(
            (user) =>
                user.user_name.toLowerCase().includes(query) ||
                user.user_email_id?.toLowerCase().includes(query) ||
                user.user_job_title?.toLowerCase().includes(query)
        )
    }, [searchQuery, usersList.data?.users])

    const handleSelect = (user: UserProfileDataInterface) => {
        setSelectedUser(user)
        onSelect(user)
    }



    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                <Input
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <User className="mx-auto h-12 w-12 mb-2 opacity-50"/>
                        <p>No users found</p>
                        <p className="text-sm">Try adjusting your search terms</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user.user_uuid}
                            onClick={() => handleSelect(user)}
                            className={`
                    flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${
                                selectedUser?.user_uuid === user.user_uuid
                                    ? "bg-primary/10 border-primary"
                                    : "bg-card hover:bg-accent border-border"
                            }
                  `}
                        >
                            <ChatUserListUserAvatar userProfileObjKey={user.user_profile_object_key} userName={user.user_name} />


                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-sm text-foreground truncate">{user.user_name}</p>
                                    {selectedUser?.user_uuid === user.user_uuid &&
                                        <Check className="h-4 w-4 text-primary flex-shrink-0"/>}
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
                    ))
                )}
            </div>

        </div>


    )
}
