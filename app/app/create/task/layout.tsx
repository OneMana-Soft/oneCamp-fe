"use client"

import {useMedia} from "@/context/MediaQueryContext";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {openUI} from "@/store/slice/uiSlice";
import {useRouter} from "next/navigation";
import {app_channel_path, app_my_task_path} from "@/types/paths";

export default function PostLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    const {isMobile, isDesktop} = useMedia()
    const dispatch = useDispatch();
    const router = useRouter()

    useEffect(() => {
        if (isDesktop) {
            dispatch(openUI({ key: 'createTask' }))
            router.push(app_my_task_path);

        }
    }, [isDesktop]);

    return (
        <>
            {
                isMobile && <>{children}</>
            }
        </>
    )
}