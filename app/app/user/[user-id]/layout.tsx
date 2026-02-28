"use client"

import { useEffect, ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useMedia } from "@/context/MediaQueryContext";
import { openUI } from "@/store/slice/uiSlice";

export default function MobileOtherUserProfileLayout({ 
    children
}: Readonly<{ 
    children: ReactNode
}>) {
    const params = useParams();
    const userUUID = params["user-id"] as string;
    const { isDesktop } = useMedia();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isDesktop) {
            router.replace("/app/home");
            setTimeout(() => {
                dispatch(openUI({ key: "otherUserProfile", data: { userUUID } }));
            }, 100);
        }
    }, [isDesktop, router, dispatch, userUUID]);

    // Avoid flashing mobile UI on desktop while redirecting
    if (isDesktop === undefined || isDesktop) return null;

    return <>{children}</>;
}
