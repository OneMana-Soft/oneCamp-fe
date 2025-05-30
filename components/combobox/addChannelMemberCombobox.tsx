"use client"

import {useState} from "react";
import {Check, ChevronsUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils/cn";
import {useFetch} from "@/hooks/useFetch";
import {UserListInterfaceResp} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";


interface AddTeamMemberComboboxPropInterface {
    handleAddMember: (id: string) => void
    channelId: string
}

const AddTeamMemberCombobox: React.FC<AddTeamMemberComboboxPropInterface> = ({handleAddMember, channelId}) => {


    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const usersList = useFetch<UserListInterfaceResp>(channelId ? GetEndpointUrl.UserListNotBelongToChannel + '/' + channelId : '')

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
                        className="w-[200px] justify-between font-normal h-8"
                        size="sm"
                    >
                        {value
                            ? usersList.data?.users?.find((framework) => framework.user_uuid === value)?.user_name
                            : "Selected user"
                        }
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
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
                                    >
                                        {user.user_name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
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

            <Button variant="outline" size="sm" className="h-8" onClick={()=>{handleOnClick(value)}}>
                {"Add member"}
            </Button>
        </div>

    )
}

export default AddTeamMemberCombobox;
