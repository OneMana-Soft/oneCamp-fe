import { throttle } from 'lodash';
import { useCallback, useMemo } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { PostEndpointUrl } from '@/services/endPoints';

export type PublishTypingTargetType = 'channel' | 'chat' | 'groupChat';

interface PublishTypingProps {
    targetType: PublishTypingTargetType;
    targetId: string; // channelId, or userUuid (for DM), or grpUuid (for GroupChat)
}

export const usePublishTyping = ({ targetType, targetId }: PublishTypingProps) => {
    const publish = useCallback(() => {
        if (!targetId) return;

        if (targetType === 'channel') {
            axiosInstance.post(PostEndpointUrl.PublishChannelTyping, { channel_id: targetId }).catch(() => {});
        } else if (targetType === 'chat') {
            axiosInstance.post(PostEndpointUrl.PublishChatTyping, { user_uuid: targetId }).catch(() => {});
        } else if (targetType === 'groupChat') {
            axiosInstance.post(PostEndpointUrl.PublishChatTyping, { grp_id: targetId }).catch(() => {});
        }
    }, [targetType, targetId]);

    // Throttle the publish function to execute at most once every 3 seconds
    const publishWithThrottle = useMemo(
        () => throttle(publish, 3000, { trailing: false }),
        [publish]
    );

    return { publishTyping: publishWithThrottle };
};
