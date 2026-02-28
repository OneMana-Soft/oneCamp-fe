"use client"
import React, { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {EllipsisVertical, Minimize2, Maximize2, ArrowRightToLine, CircleCheck, Trash, Link} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {closeRightPanel} from "@/store/slice/desktopRightPanelSlice";
import {useDispatch} from "react-redux";
import { cn } from "@/lib/utils/helpers/cn";
import {useMedia} from "@/context/MediaQueryContext";
import {useCopyToClipboard} from "@/hooks/useCopyToClipboard";
import {app_channel_path, app_task_path} from "@/types/paths";

type HeaderActionsProps = {
    isAdmin: boolean
    canMarkComplete: boolean
    onMarkComplete: () => void
    onDeleteTask?: () => void
    taskUUID: string
}

export function RightPanelTaskHeader({
                                  isAdmin,
                                  canMarkComplete,
                                  onMarkComplete,
                                  onDeleteTask,
                                    taskUUID,
                              }: HeaderActionsProps) {
    const [isAnimating, setIsAnimating] = useState(false)
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const { isDesktop, isMobile} = useMedia()
    const copyToClipboard = useCopyToClipboard()

    const copyTaskLink = useCallback(
        ()=>{
            const host = window.location.host;
            const protocol = window.location.protocol;
            const baseUrl = `${protocol}//${host}`;
            const newPath = `${app_task_path}/${taskUUID}`

            copyToClipboard.copy(`${baseUrl}${newPath}`, 'copied link')
        },[taskUUID]
    )

    const handleMarkComplete = useCallback(() => {
        try {
            // Clear any existing timeout
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current)
            }

            // Start animation
            setIsAnimating(true)
            
            // Remove animation state after animation completes
            animationTimeoutRef.current = setTimeout(() => {
                setIsAnimating(false)
                animationTimeoutRef.current = null
            }, 1200) // Animation duration

            // Call the original handler
            onMarkComplete()
        } catch (error) {
            console.error('Error handling mark complete:', error)
            // Fallback to direct call without animation
            onMarkComplete()
        }
    }, [onMarkComplete])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current)
            }
        }
    }, [])

    const dispatch = useDispatch()
    return (
        <div className={cn("justify-center items-center px-2 py-2 flex-shrink-0", isAnimating && "animate-gradient-completion")}>
            <div className="flex ">
                <div className="flex-1">
                    {canMarkComplete && (
                        <div className={cn(
                            "relative overflow-hidden rounded-md",
                        )}>
                            <Button 
                                variant="ghost" 
                                className='border' 
                                onClick={handleMarkComplete} 
                                disabled={!isAdmin}
                                aria-label="Mark task as completed"
                            >
                                <CircleCheck className="h-5 w-5" />
                                <span className="">{"Mark as completed"}</span>
                            </Button>
                        </div>
                    )}
                </div>
                {isDesktop && <div className="flex justify-center items-center">

                    {isAdmin && onDeleteTask && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <EllipsisVertical className="h-3 w-3 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-fit">
                                <DropdownMenuItem className="hover:cursor-pointer text-destructive" onClick={onDeleteTask}>
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete Task
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:cursor-pointer " onClick={copyTaskLink}>
                                    <Link className="h-4 w-4 mr-2" />
                                    Copy Task Link
                                </DropdownMenuItem>
                            </DropdownMenuContent>

                        </DropdownMenu>
                    )}
                    <Button variant="ghost" size="icon" onClick={()=>{dispatch(closeRightPanel())}}>
                        <ArrowRightToLine className="h-3 w-3" />
                    </Button>
                </div>}
            </div>
        </div>
    )
}
