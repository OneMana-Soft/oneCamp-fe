// hooks/useGenericForm.ts
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosInstance";
import { PostEndpointUrl} from "@/services/endPoints";
import {GenericResponse} from "@/types/genericRes";

interface UsePostOptions<T> {
    apiEndpoint: PostEndpointUrl;
    payload?: T;
    appendToUrl?: string;
    onSuccess?: () => void;
    showToast?: boolean;
}


const endpointMessages: Record< PostEndpointUrl, { success: string; error: string }> = {
    [PostEndpointUrl.CreateTeam]: {
        success: "Team created successfully.",
        error: "Failed to create team.",
    },
    [PostEndpointUrl.CreateProject]: {
        success: "Project created successfully.",
        error: "Failed to create project.",
    },
    [PostEndpointUrl.CreateChannel]: {
        success: "Channel created successfully.",
        error: "Failed to create channel.",
    },
    [PostEndpointUrl.AddFavChannel]: {
        success: "Added channel to fav successfully.",
        error: "Failed add channel to fav.",
    },
    [PostEndpointUrl.RemoveFavChannel]: {
        success: "Removed channel from fav successfully.",
        error: "Failed to removed channel from fav.",
    },
    [PostEndpointUrl.UpdateChannelNotification]: {
        success: "Updated channel notification successfully.",
        error: "Failed to update channel notification.",
    },
    [PostEndpointUrl.AddChannelMember]: {
        success: "Added member to channel successfully.",
        error: "Failed to add member to channel.",
    },
    [PostEndpointUrl.AddChannelModerator]: {
        success: "Added admin to channel successfully.",
        error: "Failed to add member to channel.",
    },
    [PostEndpointUrl.RemoveChannelMember]: {
        success: "Removed member from channel successfully.",
        error: "Failed to remove member from channel.",
    },
    [PostEndpointUrl.RemoveChannelModerator]: {
        success: "Removed admin from channel successfully.",
        error: "Failed to remove admin from channel.",
    },
    [PostEndpointUrl.UpdateChannel]: {
        success: "Updated channel successfully.",
        error: "Failed to update channel.",
    },
    [PostEndpointUrl.CreateChannelPost]: {
        success: "Created post successfully.",
        error: "Failed to create post.",
    },
    [PostEndpointUrl.SearchUserAndChannel]: {
        success: "Got search result.",
        error: "Failed to get search result.",
    },
};

export const usePost = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { toast } = useToast();


    const makeRequest = async  <T, R=GenericResponse>(options: UsePostOptions<T>):  Promise<R | undefined> => {
        const { apiEndpoint, payload, appendToUrl, onSuccess, showToast} = options;

        // Get success and error messages based on the API endpoint
        const { success: successMessage, error: errorMessage } =
        endpointMessages[apiEndpoint] || {
            success: "Operation completed successfully.",
            error: "An error occurred.",
        };


        setIsSubmitting(true);

        try {


            const response = await axiosInstance.post(`${apiEndpoint}${appendToUrl ? appendToUrl: ''}`, payload);

            if(showToast) {
                toast({
                    title: "Success",
                    description: successMessage,
                });
            }

            if(onSuccess) {
                onSuccess()
            }
            return response.data.data ?? response.data

        } catch (e) {
            const error = e instanceof Error ? e.message : "Unknown error";
            if(showToast) {
                toast({
                    title: "Error",
                    description: `${errorMessage}: ${error}`,
                    variant: 'destructive'
                });
            }


        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        makeRequest,
        isSubmitting,
    };
};