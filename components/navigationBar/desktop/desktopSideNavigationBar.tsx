"use client";

import { ChevronRight, Plus} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import {Button, buttonVariants} from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import Link from "next/link";
import {DesktopNavType} from "@/types/nav";


export function DesktopSideNavigationBar({ links, isCollapsed }: {links:DesktopNavType[], isCollapsed: boolean}) {


    return (
        <div
            data-collapsed={isCollapsed}
            className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
        >
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {links.map((link, index) =>
                        isCollapsed ? !link.children && (
                            <Tooltip key={index} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={`/${link.path}`}
                                        className={cn("hover:cursor-pointer",
                                            buttonVariants({ variant: link.variant, size: "icon" }),
                                            "h-10 w-10",
                                            link.variant === "default" &&
                                            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                                        )}
                                    >
                                        {link?.icon && <link.icon className="h-4 w-4" />}
                                        <span className="sr-only">{link.title}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="flex items-center gap-4">
                                    {link.title}
                                    {link.label && (
                                        <span className="ml-auto text-muted-foreground">
                    {link.label}e
                  </span>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            link.children ?
                                <div key={index} className='mt-3 md:mt-1'>
                                    <Collapsible
                                        open={link.isOpen}
                                        onOpenChange={link.setIsOpen}
                                        className="w-full "
                                    >
                                        <div className="flex items-center justify-between space-x-4  mb-2 md:mb-1">
                                            <div className="flex justify-center items-center ">
                                                <CollapsibleTrigger asChild>
                                                    <div
                                                        className='flex hover:cursor-pointer space-x-4 justify-center items-center '
                                                    >

                                                            <ChevronRight
                                                                          className={cn(
                                                                              "h-6 w-6 md:h-4 md:w-4 transition-all duration-200 ease-in-out transform", // Base transition and transform
                                                                              link.isOpen ? "rotate-90" : "rotate-0" ,// Conditional rotation
                                                                              "transition-all duration-200 ease-in-out transform"
                                                                          )}
                                                            />

                                                        <div className='flex justify-center items-center'>
                                                            {link.icon && <link.icon className="mr-2 md:h-4 md:w-5 h-6 w-5" />}
                                                            <span className=" text-md md:text-sm  capitalize">
                          {link.title}
                        </span>
                                                        </div>



                                                    </div>
                                                </CollapsibleTrigger>

                                            </div>
                                            <div>
                                                {link.action && <Button variant="ghost" size="icon" onClick={link.action}>
                                                    <Plus className='size-2'/>
                                                </Button>}
                                            </div>

                                        </div>
                                        <CollapsibleContent className="space-y-2">
                                            {link.children.map((ch,chIn)=>{

                                                return(
                                                    <Link
                                                        key={chIn}
                                                        href={`${ch.path}`}
                                                        className={cn("hover:cursor-pointer w-full",
                                                            buttonVariants({ variant: ch.variant, size: "sm" }),
                                                            ch.variant === "default" &&
                                                            "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                                            "justify-start space-x-2 md:space-x-1"
                                                        )}
                                                    >
                                                        {link.icon && <link.icon className=" md:h-4 md:w-5 h-6 w-5" />}
                                                        <div className=' md:text-sm font-normal text-lg'>{ch.title}</div>

                                                    </Link>
                                                )

                                            })}

                                        </CollapsibleContent>
                                    </Collapsible>

                                </div>
                                :
                                <Link
                                    key={index}
                                    href={`/${link.path}`}
                                    className={cn("hover:cursor-pointer",
                                        buttonVariants({ variant: link.variant, size: "sm" }),
                                        link.variant === "default" &&
                                        "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                        "justify-start"
                                    )}
                                >
                                    {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                                    {link.title}
                                    {link.label && (
                                        <span
                                            className={cn(
                                                "ml-auto",
                                                link.variant === "default" &&
                                                "text-background dark:text-white"
                                            )}
                                        >
                  {link.label}
                </span>
                                    )}
                                </Link>
                        )
                )}
            </nav>
        </div>
    );
}
