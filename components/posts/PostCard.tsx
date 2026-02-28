import React from "react";
import { PostsRes } from "@/types/post";
import { format } from "date-fns";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, StickyNote } from "lucide-react";
import { removeHtmlTags } from "@/lib/utils/removeHtmlTags";
import addEmojiIconSrc from "@/assets/addEmoji.svg";
import { useMediaFetch } from "@/hooks/useFetch";
import { GetMediaURLRes } from "@/types/file";
import { GetEndpointUrl } from "@/services/endPoints";
import { getNameInitials } from "@/lib/utils/getNameInitials";

interface PostCardProps {
  post: PostsRes;
  onClick?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const totalReactions = post.post_reactions?.length || 0;
  const profileImageRes = useMediaFetch<GetMediaURLRes>(
    post.post_by.user_profile_object_key
      ? GetEndpointUrl.PublicAttachmentURL +
          "/" +
          post.post_by.user_profile_object_key
      : ""
  );

  return (
    <div
      onClick={onClick}
      className="group flex items-start gap-4 p-4 border-b hover:cursor-pointer hover:bg-primary/10 hover:shadow-xl cursor-pointer transition-all duration-200"
    >
      {/* Avatar Section */}
      <div className="relative shrink-0 mt-0.5">
        <Avatar className="w-10 h-10 ring-2 ring-background shadow-sm group-hover:ring-muted transition-all">
          <AvatarImage
            src={profileImageRes.data?.url || ""}
            alt={post.post_by?.user_full_name}
            className="object-cover"
          />
          <AvatarFallback className="text-xs font-semibold">
            {getNameInitials(
              post.post_by?.user_full_name || post.post_by?.user_name || "?"
            )}
          </AvatarFallback>
        </Avatar>

      </div>

      {/* Content Section */}
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col">
            <span className="font-semibold text-foreground leading-tight">
              {post.post_by?.user_full_name ||
                post.post_by?.user_name ||
                "Unknown User"}
            </span>
            <span className="text-xs text-muted-foreground/80">
              {post.post_channel
                ? `posted in #${post.post_channel.ch_name}`
                : "posted an update"}
            </span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground/70 bg-muted/50 px-1.5 py-0.5 rounded shrink-0">
            {post.post_created_at
              ? format(new Date(post.post_created_at), "MMM d, h:mm a")
              : ""}
          </span>
        </div>

        <div className="text-foreground/80 leading-relaxed font-normal line-clamp-3 bg-muted/10 p-2 rounded-md border border-border/20 group-hover:border-border/40 transition-colors">
          {removeHtmlTags(post.post_text)}
        </div>

        {/* Footer info: simple stats box to keep info available but clean */}
        <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground/60">
          <div className="flex items-center gap-1.5 transition-colors">
            <MessageSquare className="h-3 w-3" />
            <span>{post.post_comment_count || 0}</span>
          </div>
          {totalReactions > 0 && (
            <div className="flex items-center gap-1.5 transition-colors">
              <Image
                src={addEmojiIconSrc || "/placeholder.svg?height=16&width=16"}
                alt="Reactions"
                width={12}
                height={12}
                className="grayscale opacity-70"
              />
              <span>{totalReactions}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

