"use client";


import { useEffect } from "react"
import { useMedia } from "@/context/MediaQueryContext"
import { useDispatch } from "react-redux"
import { openRightPanel } from "@/store/slice/desktopRightPanelSlice"
import { useParams, useRouter } from "next/navigation"
import TaskInfoPanel from "@/components/rightPanel/taskInfoPanel"
import { app_my_task_path } from "@/types/paths"

export default function Page() {
    const { isMobile, isDesktop } = useMedia()

    const dispatch = useDispatch()
    const params = useParams()
    const taskId = params?.["task-id"] as string
    const router = useRouter()

    useEffect(() => {
        if (isDesktop) {
            dispatch(
                openRightPanel({
                    taskUUID: taskId,
                    chatMessageUUID: "",
                    chatUUID: "",
                    channelUUID: "",
                    postUUID: "",
                    groupUUID: "",
                    docUUID: ""
                }),
            )

            router.push(app_my_task_path)
        }
    }, [isDesktop])

    return <>{isMobile && <TaskInfoPanel taskUUID={taskId} />}</>
}
