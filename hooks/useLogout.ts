"use client"

import { usePost } from "@/hooks/usePost";
import { PostEndpointUrl } from "@/services/endPoints";

export const useLogout = () => {
    const { makeRequest, isSubmitting } = usePost();

    const logout = async () => {
        try {
            await makeRequest({
                apiEndpoint: PostEndpointUrl.Logout,
                showToast: false, // We'll handle redirection which is feedback enough
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            // Redirect to login page
            window.location.href = '/';
        }
    };

    return { logout, isSubmitting };
};
