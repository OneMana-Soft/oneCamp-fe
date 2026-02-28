"use client"

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useMedia } from "@/context/MediaQueryContext";
import { openUI } from "@/store/slice/uiSlice";

export default function MobileSelfProfileLayout({ children }: { children: ReactNode }) {
    const { isDesktop } = useMedia();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isDesktop) {
            router.replace("/app/home");
            setTimeout(() => {
                dispatch(openUI({ key: "selfUserProfile" }));
            }, 100);
        }
    }, [isDesktop, router, dispatch]);

    // Avoid flashing mobile UI on desktop while redirecting
    if (isDesktop === undefined || isDesktop) return null;

    return <>{children}</>;
}
