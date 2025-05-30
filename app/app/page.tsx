"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { app_home_path } from "@/types/paths";

export default function App() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the home path
        router.push(app_home_path);
    }, [router]); // Dependency array ensures this runs only once

    return null; // Render nothing
}