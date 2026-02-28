"use client"

import React from "react"
import { UserProfileDataInterface } from "@/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ShieldCheck, UserMinus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { openUI } from "@/store/slice/uiSlice"

import { VirtualInfiniteScroll } from "@/components/list/virtualInfiniteScroll"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AdminAdminListProps {
  admins: UserProfileDataInterface[]
  onRemoveAdmin: (email: string, userID: string) => void
  isSubmitting: boolean
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  currentUserUUID?: string
}

export const AdminAdminList: React.FC<AdminAdminListProps> = ({
  admins,
  onRemoveAdmin,
  isSubmitting,
  onLoadMore,
  hasMore,
  isLoading,
  currentUserUUID,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleOpenProfile = (userUUID: string) => {
    if (!userUUID) return
    dispatch(openUI({ key: "otherUserProfile", data: { userUUID } }))
  }

  const renderAdminItem = (admin: UserProfileDataInterface) => (
    <div
      key={admin.user_uuid}
      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all hover:shadow-sm mb-4"
    >
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => handleOpenProfile(admin.user_uuid)}
      >
        <div className="relative">
          <Avatar className="h-10 w-10 border border-border/50">
            <AvatarImage
              src={admin.user_profile_object_key}
              alt={admin.user_full_name || admin.user_name || admin.user_email_id}
            />
            <AvatarFallback>
              {(admin.user_full_name || admin.user_name || admin.user_email_id || "U").substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5 border border-background">
            <ShieldCheck className="h-3 w-3" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-none">
            {admin.user_full_name || admin.user_name || admin.user_email_id}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {admin.user_email_id}
          </span>
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onRemoveAdmin(admin.user_email_id!, admin.user_uuid)}
            disabled={isSubmitting || admin.user_uuid === currentUserUUID}
          >
            <UserMinus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {admin.user_uuid === currentUserUUID 
              ? "You cannot remove yourself as admin" 
              : "Remove Admin Privileges"}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  )

  return (
    <TooltipProvider>
      <VirtualInfiniteScroll
        items={admins}
        renderItem={renderAdminItem}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        keyExtractor={(admin) => admin.user_uuid}
        emptyComponent={
          <div className="text-center py-8 text-muted-foreground text-sm italic">
            No administrators found.
          </div>
        }
      />
    </TooltipProvider>
  )
}
