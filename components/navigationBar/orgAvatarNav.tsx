"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import * as React from "react";
import {getNameInitials} from "@/lib/utils/getNameIntials";

export function OrgAvatarNav() {

    const orgNameInitials = getNameInitials(process.env.NEXT_PUBLIC_ORG_NAME)


    return (
        <Avatar className='h-8 w-8  hover:cursor-pointer' >
            <AvatarImage src="/logoo.svg" alt="@shadcn"/>
            <AvatarFallback  className="bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 text-white md:text-sm">{orgNameInitials}</AvatarFallback>
        </Avatar>

    )

}