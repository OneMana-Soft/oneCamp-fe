"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";

type MediaQueryContextType = {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
};

const MediaQueryContext = createContext<MediaQueryContextType | undefined>(undefined);

export function MediaQueryProvider({ children }: { children: React.ReactNode }) {
    const [screenSize, setScreenSize] = useState<MediaQueryContextType>({
        isMobile: false,
        isTablet: false,
        isDesktop: false,
    });

    useLayoutEffect(() => {
        const updateSize = () => {
            setScreenSize({
                isMobile: window.innerWidth < 640, // Tailwind's `sm`
                isTablet: window.innerWidth >= 640 && window.innerWidth < 1024, // `md`
                isDesktop: window.innerWidth >= 1024, // `lg`
            });
        };

        updateSize(); // Check on mount
        window.addEventListener("resize", updateSize);

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return <MediaQueryContext.Provider value={screenSize}>{children}</MediaQueryContext.Provider>;
}

export function useMedia() {
    const context = useContext(MediaQueryContext);
    if (!context) throw new Error("useMedia must be used within a MediaQueryProvider");
    return context;
}