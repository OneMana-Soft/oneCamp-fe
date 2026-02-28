"use client"

import React from 'react';
import { Crown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {UserProfileDataInterface, UserProfileInterface} from "@/types/user";
import {getNameInitials} from "@/lib/utils/format/getNameIntials";
import {useFetch, useFetchOnlyOnce, useMediaFetch} from "@/hooks/useFetch";
import {GetEndpointUrl} from "@/services/endPoints";
import {GetMediaURLRes} from "@/types/file";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings2 } from "lucide-react";

interface MemberPropInfoInterface {
    userInfo: UserProfileDataInterface;
    isAdmin: boolean;
    handleMakeAdmin: (id: string) => void;
    handleRemoveAdmin: (id: string) => void;
    handleRemoveMember: (id: string) => void;
    blockedUUID: boolean;
}

const MemberInfo: React.FC<MemberPropInfoInterface> = ({
  userInfo,
  isAdmin,
  blockedUUID,
  handleRemoveAdmin,
  handleMakeAdmin,
  handleRemoveMember
}) => {
  const profileImageRes = useMediaFetch<GetMediaURLRes>(userInfo.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL + '/' + userInfo.user_profile_object_key : '');
  const nameInitial = getNameInitials(userInfo.user_name);

  const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

  const handleCrownClick = () => {
    if (!isAdmin || blockedUUID) return;
    if (userInfo.user_is_admin) {
      handleRemoveAdmin(userInfo.user_uuid);
    } else {
      handleMakeAdmin(userInfo.user_uuid);
    }
  };

  const handleLogOutClick = () => {
    if (!blockedUUID) {
      handleRemoveMember(userInfo.user_uuid);
    }
  };

  return (
    <TooltipProvider>
      <div className='group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-muted/30 hover:shadow-sm transition-all duration-300 ease-in-out mb-2'>
        <div className='flex items-center space-x-4 min-w-0'>
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-background ring-1 ring-border shadow-sm transition-transform duration-300 group-hover:scale-105">
              <AvatarImage
                src={profileImageRes.data?.url || ""}
                alt={userInfo.user_name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {nameInitial}
              </AvatarFallback>
            </Avatar>
            {userInfo.user_is_admin && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-0.5 border-2 border-background shadow-sm">
                <Crown className="h-2.5 w-2.5 fill-current" />
              </div>
            )}
          </div>
          <div className='flex flex-col min-w-0'>
            <div className='flex items-center gap-2'>
              <span className='truncate text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors'>
                {userInfo.user_name}
              </span>
              {selfProfile.data?.data && selfProfile.data?.data.user_uuid == userInfo.user_uuid && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm animate-in fade-in slide-in-from-left-1">
                  You
                </span>
              )}
            </div>
            <span className='truncate text-xs text-muted-foreground/80 leading-tight mt-0.5 font-medium'>
              {userInfo.user_email_id}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0'>
          <div className="flex items-center justify-end min-w-[100px] gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-full transition-all duration-300 ${
                    userInfo.user_is_admin 
                      ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50/80 active:scale-95 shadow-sm" 
                      : "text-muted-foreground/60 hover:text-primary hover:bg-primary/5 active:scale-95"
                  }`}
                  onClick={handleCrownClick}
                  disabled={!isAdmin || blockedUUID}
                >
                  <Crown
                    className={`h-4.5 w-4.5 ${userInfo.user_is_admin ? 'animate-in zoom-in-50 duration-500' : ''}`}
                    fill={userInfo.user_is_admin ? 'currentColor' : 'none'}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <p>{userInfo.user_is_admin ? "Remove Admin Role" : "Make Admin"}</p>
              </TooltipContent>
            </Tooltip>

            {(blockedUUID || (!isAdmin && selfProfile.data?.data.user_uuid != userInfo.user_uuid)) ? (
              <div className="w-9" /> // Placeholder to keep crown position stable
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 active:scale-95 transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={handleLogOutClick}
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p>Remove Member</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MemberInfo;

