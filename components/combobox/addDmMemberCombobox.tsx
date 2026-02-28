"use client"

import {useState} from "react";
import {Check, ChevronsUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils/helpers/cn";
import {useFetch} from "@/hooks/useFetch";
import {UserListInterfaceResp} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getNameInitials} from "@/lib/utils/format/getNameIntials";


interface AddTeamMemberComboboxPropInterface {
    handleAddMember: (id: string) => void
    grpId: string
}

const AddDmMemberCombobox: React.FC<AddTeamMemberComboboxPropInterface> = ({handleAddMember, grpId}) => {


    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const usersList = useFetch<UserListInterfaceResp>(grpId ? GetEndpointUrl.UserListNotBelongToDm + '/' + grpId : '')

    const handleOnClick = async (id: string) => {
        if(!id) return
        await handleAddMember(id)
        setValue("")
    }

    return (
        <div className='flex gap-x-3'>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[220px] justify-between font-normal h-10 bg-muted/20 border-border/40 hover:bg-muted/40 hover:border-border/60 hover:shadow-sm transition-all duration-300 rounded-xl"
                        size="sm"
                    >
                        <span className="truncate text-sm font-medium">
                            {value
                                ? usersList.data?.users?.find((framework) => framework.user_uuid === value)?.user_name
                                : "Search members..."
                            }
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent portalled={false} className="w-[240px] p-0 shadow-xl border-border/50">
                    <Command>
                        <CommandInput placeholder="Search user..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>{"No user found"}</CommandEmpty>
                            <CommandGroup>
                                {usersList.data?.users?.map((user) => (
                                    <CommandItem
                                        key={user.user_uuid}
                                        value={user.user_uuid}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                        className="cursor-pointer p-2 rounded-lg m-1 gap-3 aria-selected:bg-primary/5 transition-colors duration-200"
                                    >
                                        <Avatar className="h-8 w-8 border border-border/50 flex-shrink-0">
                                            <AvatarImage
                                                src={user.user_profile_object_key ? `${GetEndpointUrl.PublicAttachmentURL}/${user.user_profile_object_key}` : ""}
                                                alt={user.user_name}
                                            />
                                            <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
                                                {getNameInitials(user.user_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="font-semibold text-sm truncate">{user.user_name}</span>
                                            <span className="text-[10px] text-muted-foreground truncate font-medium">{user.user_email_id}</span>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4 text-primary",
                                                value === user.user_uuid ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Button 
                variant="default" 
                size="sm" 
                className="h-10 px-5 font-semibold shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 rounded-xl bg-primary hover:bg-primary/90" 
                onClick={()=>{handleOnClick(value)}}
                disabled={!value}
            >
                Add Member
            </Button>
        </div>

    )
}

export default AddDmMemberCombobox;
