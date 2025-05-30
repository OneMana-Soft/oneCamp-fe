"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useFetch } from "@/hooks/useFetch";
import { UserProfileInterface } from "@/types/user";
import {error_not_authorised_path} from "@/types/paths";
import {GetEndpointUrl} from "@/services/endPoints";

export function AppProtectedRoute({ children }: { children: React.ReactNode }) {



    const userProfile = useFetch<UserProfileInterface>(GetEndpointUrl.SelfProfile);
    const router = useRouter();

    useEffect(() => {
        if (userProfile.isError) {
            router.push(error_not_authorised_path);
        } else if (!userProfile.isLoading && !userProfile.data?.data) {
            router.push(error_not_authorised_path);
        }
    }, [userProfile.isError, userProfile.isLoading, userProfile.data, router]);

    if (userProfile.isLoading) {
        return (
            <div className='flex justify-center items-center h-[100vh] space-x-3'>
                <Loader2 className="size-10 animate-spin" />
            </div>
        );
    }

    if (!userProfile.isLoading && userProfile.data?.data) {
        return children;
    }

    return null;


    // return children


}