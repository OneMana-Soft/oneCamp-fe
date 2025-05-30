import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import axiosInstance from "@/lib/axiosInstance";

const fetcher = async <T>(url: string): Promise<T> => {
    const f = axiosInstance.get(url).then((response) => response.data);

    return f;
};
export function useInfiniteLoad<T, K>(
    path: string,
    extractItems: (pageData: T) => K[], // Ensure extracted items have a specific type
    pageSize: number = 10 // Default page size
) {
    const { ref, inView } = useInView();

    const getKey = (pageIndex: number, previousPageData: T | null) => {
        if (previousPageData && extractItems(previousPageData).length < pageSize) return null;
        return `${path}?page=${pageIndex + 1}`;
    };

    const { data, error, size, setSize, isValidating } = useSWRInfinite<T>(getKey, fetcher);

    const items: K[] = data ? data.flatMap((page) => extractItems(page)) : [];
    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = data?.[0] && extractItems(data[0]).length === 0;
    const isReachingEnd = isEmpty || (data && extractItems(data[data.length - 1]).length < pageSize);

    useEffect(() => {
        if (inView && !isLoadingMore && !isReachingEnd) {
            setSize(size + 1);
        }
    }, [inView, isLoadingMore, isReachingEnd, setSize, size]);

    return {
        items,
        error,
        isLoadingInitialData,
        isLoadingMore,
        isEmpty,
        isReachingEnd,
        loadMoreRef: ref,
    };
}
