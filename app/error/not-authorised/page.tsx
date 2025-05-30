"use client"

import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";

export default function NotAuthorised() {
    return (
        <div
            className="flex flex-col md:flex-row justify-center items-center h-[100vh] text-xl md:text-3xl space-y-4 md:space-y-0 md:space-x-4 p-4">
            <div className="text-center md:text-left">401</div>
            <Separator
                orientation="vertical"
                className="hidden md:block h-10"
            />
            <Separator
                orientation="horizontal"
                className="block md:hidden w-16"
            />
            <div className="text-center md:text-left">
                Not Authorised
            </div>
            <Button>
                Go to login page
            </Button>
        </div>
)
}