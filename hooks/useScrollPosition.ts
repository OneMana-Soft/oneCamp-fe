import { useState, useEffect, useCallback } from 'react';

interface ScrollState {
    atTop: boolean;
    atBottom: boolean;
    scrollPercentage: number;
}

export const useScrollPosition = (ref: React.RefObject<HTMLDivElement>) => {
    const [scrollState, setScrollState] = useState<ScrollState>({
        atTop: true,
        atBottom: false,
        scrollPercentage: 0,
    });

    const handleScroll = useCallback(() => {
        if (!ref.current) return;

        const { scrollTop, scrollHeight, clientHeight } = ref.current;
        const maxScroll = scrollHeight - clientHeight;

        const atTop = scrollTop <= 10;
        const atBottom = maxScroll - scrollTop <= 10;
        const scrollPercentage = (scrollTop / maxScroll) * 100;

        setScrollState({
            atTop,
            atBottom,
            scrollPercentage: Number.isFinite(scrollPercentage) ? scrollPercentage : 0,
        });
    }, [ref]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        element.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => element.removeEventListener('scroll', handleScroll);
    }, [ref, handleScroll]);

    return scrollState;
};