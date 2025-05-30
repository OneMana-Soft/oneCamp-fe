"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import * as React from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";


export function UserAvatarNav() {

    return (
        <Tooltip >
            <TooltipTrigger asChild>
                <Avatar className='h-8 w-8 hover:cursor-pointer' >
                    <AvatarImage src="/logoo.svg" alt="@shadcn"/>
                    <AvatarFallback  className="bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 text-white md:text-sm">AH</AvatarFallback>
                </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">

                        <span className="ml-auto">
                    Profile and settings
                  </span>

            </TooltipContent>
        </Tooltip>

        )

}