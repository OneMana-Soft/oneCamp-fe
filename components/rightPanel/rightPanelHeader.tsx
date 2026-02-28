"use client"

import { Button } from "@/components/ui/button"
import { ArrowRightToLine } from "lucide-react"
import { useDispatch } from "react-redux"
import { closeRightPanel } from "@/store/slice/desktopRightPanelSlice"

interface rightPanelHeaderProps {
    titleKey: string
}

export const RightPanelHeader = ({titleKey}:rightPanelHeaderProps) => {
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(closeRightPanel())
    }

    const renderHeader = () => {
         switch(titleKey) {
             case 'thread':
                 return (
                     <div className="min-h-12 flex justify-between items-center px-4 ">
                         <h2 className="text-lg font-bold">Thread</h2>
                         <Button size="icon" variant="ghost" onClick={handleClose}>
                             <ArrowRightToLine/>
                         </Button>
                     </div>
                 )

             case 'docComment':
                 return (
                     <div className="min-h-12 flex justify-between items-center px-4 ">
                         <h2 className="text-lg font-bold">Comments</h2>
                         <Button size="icon" variant="ghost" onClick={handleClose}>
                             <ArrowRightToLine/>
                         </Button>
                     </div>
                 )
         }

         return null
    }

    return (
        <>
            {renderHeader()}
        </>
    )
}
