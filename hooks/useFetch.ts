"use client"

import useSWR from 'swr';
import axiosInstance from "@/lib/axiosInstance";

const fetcher = async <T>(url: string): Promise<T> => {
    const f = axiosInstance.get(url).then((response) => response.data);

    return f;
};

export const useFetch = <T>(url: string) => {
    const { data, error, isLoading, isValidating } = useSWR<T>(url == '' ? null : url, fetcher);

    return {
        data,
        isLoading: isLoading || isValidating,
        isError: error,
    };
};
