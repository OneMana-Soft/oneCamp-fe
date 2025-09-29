"use client"

import useSWR from 'swr';
import axiosInstance from "@/lib/axiosInstance";

const fetcher = async <T>(url: string): Promise<T> => {
    const f = axiosInstance.get(url).then((response) => response.data);

    return f;
};

export const useFetch = <T>(url: string) => {
    const { data, error, isLoading, isValidating, mutate } = useSWR<T>(url == '' ? null : url, fetcher);

    return {
        data,
        isLoading: isLoading || isValidating,
        isError: error,
        mutate
    };
};


export const useFetchOnlyOnce = <T>(url: string) => {
    const { data, error, isLoading, isValidating, mutate } = useSWR<T>(url == '' ? null : url, fetcher, {
        revalidateOnFocus: false, // Disable refetch on window focus
        revalidateOnReconnect: false, // Disable refetch on reconnect
        revalidateIfStale: false
    });

    return {
        data,
        isLoading: isLoading || isValidating,
        isError: error,
        mutate
    };
};

export const useMediaFetch = <T>(url: string) => {
    const { data, error, isLoading, isValidating, mutate } = useSWR<T>(url == '' ? null : url, fetcher, {
        refreshInterval: 5*60*1000,
        revalidateOnFocus: false,
        revalidateIfStale: false
    });

    return {
        data,
        isLoading: isLoading || isValidating,
        isError: error,
        mutate
    };
};