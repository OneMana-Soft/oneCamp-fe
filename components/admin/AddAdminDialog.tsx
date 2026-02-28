"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { usePost } from "@/hooks/usePost"
import { PostEndpointUrl, GetEndpointUrl } from "@/services/endPoints"
import { UserListResponseInterface, AdminCreateOrRemoveInterface, UserProfileDataInterface } from "@/types/user"
import { useFetch } from "@/hooks/useFetch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Search, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils/helpers/cn"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AddAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export const AddAdminDialog: React.FC<AddAdminDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserProfileDataInterface | null>(null)
  
  // Reuse existing user list endpoint for search
  // In a real app, we might want a dedicated search endpoint
  const { data: userData, isLoading } = useFetch<UserListResponseInterface>(
    open ? `${GetEndpointUrl.GetAdminUserList}?pageSize=50` : ""
  )
  
  const post = usePost()

  const filteredUsers = userData?.data?.filter(user => 
    (user.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.user_email_id?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !user.user_is_admin
  ) || []

  const handleAddAdmin = async () => {
    if (!selectedUser) return

    await post.makeRequest<AdminCreateOrRemoveInterface>({
      apiEndpoint: PostEndpointUrl.CreateAdmin,
      payload: {
        user_uuid: selectedUser.user_uuid!,
      },
    })

    onSuccess()
    onOpenChange(false)
    setSelectedUser(null)
    setSearchTerm("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-width-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add Administrator
          </DialogTitle>
          <DialogDescription>
            Search for a user to promote them to an administrator role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  Loading users...
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.user_uuid}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors hover:bg-accent group",
                      selectedUser?.user_uuid === user.user_uuid && "bg-accent"
                    )}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_profile_object_key} />
                        <AvatarFallback>
                          {user.user_name?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">
                          {user.user_full_name || user.user_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.user_email_id}
                        </span>
                      </div>
                    </div>
                    {selectedUser?.user_uuid === user.user_uuid && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground italic">
                  {searchTerm ? "No matching users found." : "Start typing to search..."}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={post.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddAdmin}
            disabled={!selectedUser || post.isSubmitting}
          >
            {post.isSubmitting ? "Promoting..." : "Promote to Admin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
