"use client"

import {useMedia} from "@/context/MediaQueryContext";
import {useEffect} from "react";
import {app_home_path} from "@/types/paths";
import {useRouter} from "next/navigation";

export default function ForwardLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {


    const {isMobile, isDesktop} = useMedia()
    const router = useRouter();


    useEffect(() => {
        if (isDesktop) {
            router.push(app_home_path);
        }
    }, [isDesktop, router]);

    return (
        <>
            {
                isMobile && <>{children}</>
            }
        </>
    )

}