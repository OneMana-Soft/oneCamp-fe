import React, { useMemo } from 'react';
import { UnifiedActivityItem } from '@/types/activity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { MessageSquare, AtSign } from 'lucide-react'; // Added helpful icons
import { UserProfileDataInterface, UserProfileInterface } from "@/types/user";
import { useMediaFetch, useFetchOnlyOnce } from "@/hooks/useFetch"; // Added useFetchOnlyOnce
import { GetMediaURLRes } from "@/types/file";
import { GetEndpointUrl } from "@/services/endPoints";
import { removeHtmlTags } from "@/lib/utils/removeHtmlTags";
import { findEmojiMartEmojiByEmojiID } from "@/lib/utils/reaction/findReaction";
import { useEmojiMartData } from "@/hooks/reactions/useEmojiMartData";
import { cn } from "@/lib/utils/helpers/cn";
import { getNameInitials } from "@/lib/utils/getNameInitials";
import { useActivityNavigation } from "@/hooks/activity/useActivityNavigation";

interface ActivityCardProps {
    activity: UnifiedActivityItem;
    onClick: () => void; // Keeping prop for compatibility, though we use internal handler
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick }) => {
    const emojiData = useEmojiMartData();
    const { handleNavigation } = useActivityNavigation();
    
    // Fetch self profile to get current user ID for navigation logic
    const { data: selfProfile } = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile);
    const currentUserId = selfProfile?.data?.user_uuid;

    const { icon, title, content, user, time, typeLabel, typeColor } = useMemo(() => {
        let icon = <MessageSquare size={14} />;
        let title = "";
        let content = "";
        let user: UserProfileDataInterface | undefined;
        let time = "";
        let typeLabel: string = "Activity";
        let typeColor = "bg-gray-100 text-gray-600";

        if (activity.activity_type === "MENTION" && activity.mention) {
            icon = <AtSign size={14} className="text-blue-500" />;
            typeColor = "bg-blue-50 text-blue-600 border-blue-100";
            time = activity.mention.mention_created_at;
            
            if (activity.mention.mention_chat) {
                title = `mentioned you in a chat`;
                content = activity.mention.mention_chat.chat_body_text;
                user = activity.mention.mention_chat.chat_from;
            } else if (activity.mention.mention_post) {
                title = `mentioned you in a post`;
                content = activity.mention.mention_post.post_text;
                user = activity.mention.mention_post.post_by;
            } else if (activity.mention.mention_comment) {
                title = `mentioned you in a comment`;
                content = activity.mention.mention_comment.comment_text;
                user = activity.mention.mention_comment.comment_by;
            } else if (activity.mention.mention_task) {
                title = `mentioned you in a task`;
                content = "Task Description"; // Placeholder, maybe fetch task detail if needed
                user = activity.mention.mention_task.task_created_by; // Assuming task_created_by as fallback
            } else if (activity.mention.mention_doc) {
                title = `mentioned you in a doc`;
                content = "Document"; 
                user = activity.mention.mention_doc.doc_created_by;
            }

        } else if (activity.activity_type === "COMMENT" && activity.comment) {
            icon = <MessageSquare size={14} className="text-green-500" />;
            typeColor = "bg-green-50 text-green-600 border-green-100";
            time = activity.comment.comment_created_at;
            title = `commented on your content`; // This could be more specific
            content = activity.comment.comment_text;
            user = activity.comment.comment_by;

        } else if (activity.activity_type === "REACTION" && activity.reaction) {
            const emoji = findEmojiMartEmojiByEmojiID(emojiData.data, activity.reaction.reaction_emoji_id ?? '');
            icon = <span className=" leading-none">{emoji?.skins[0].native || "👍"}</span>;
            typeColor = "bg-orange-50 text-orange-600 border-orange-100";
            time = activity.reaction.reaction_added_at;
            title = `reacted to your content`;
            content = "Reacted with an emoji";
            user = activity.reaction.reaction_added_by;
        }

        return { icon, title, content, user, time, typeLabel, typeColor };
    }, [activity, emojiData.data]);

    const profileImageRes = useMediaFetch<GetMediaURLRes>(
        user?.user_profile_object_key 
            ? GetEndpointUrl.PublicAttachmentURL + '/' + user.user_profile_object_key 
            : ''
    );

    const handleClick = () => {
        handleNavigation(activity, currentUserId);
        if (onClick) onClick();
    };

    return (
        <div 
            className="group flex items-start gap-4 p-4 border-b hover:cursor-pointer rounded-lg hover:bg-primary/10 hover:shadow-xl cursor-pointer transition-all duration-200"
            onClick={handleClick}
        >
            {/* Avatar Section */}
            <div className="relative shrink-0 mt-0.5">
                <Avatar className="w-10 h-10 ring-2 ring-background shadow-sm group-hover:ring-muted transition-all">
                    <AvatarImage src={profileImageRes.data?.url} alt={user?.user_full_name} className="object-cover" />
                    <AvatarFallback className=" text-xs font-semibold">
                        {getNameInitials(user?.user_full_name || "?")}
                    </AvatarFallback>
                </Avatar>
                {/* Type Token Overlay */}
                <div title={typeLabel} className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-sm", typeColor)}>
                    {icon}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1  space-y-1">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col">
                        <span className="font-semibold  text-foreground leading-tight">
                            {user?.user_full_name || "Unknown User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {title}
                        </span>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground/70 bg-muted/50 px-1.5 py-0.5 rounded shrink-0">
                        {time ? format(new Date(time), 'MMM d, h:mm a') : ""}
                    </span>
                </div>

                <div className=" text-foreground/80 leading-relaxed font-normal line-clamp-2 bg-muted/10 p-2 rounded-md border border-border/20 group-hover:border-border/40 transition-colors">
                     {removeHtmlTags(content)}
                </div>
            </div>
        </div>
    );
};
