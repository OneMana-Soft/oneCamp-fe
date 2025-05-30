"use client";

import { MobileHome } from "@/components/home/mobile/mobileHome";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { app_channel_path } from "@/types/paths";
import { useMedia } from "@/context/MediaQueryContext";

export default function Home() {
    const router = useRouter();
    const { isDesktop } = useMedia();

    useEffect(() => {
        if (isDesktop) {
            router.push(app_channel_path);
        }
    }, [isDesktop, router]);

    return isDesktop ? null:<MobileHome />;
}