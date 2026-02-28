"use client"

import React, { useEffect } from "react"
import { getFCMToken, isFirebaseConfigured, messaging } from "@/lib/firebase"
import { onMessage } from "firebase/messaging"
import { usePost } from "@/hooks/usePost"
import { PostEndpointUrl } from "@/services/endPoints"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ToastAction } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import { User } from "lucide-react"

export function FCMHandler() {
  const { makeRequest } = usePost()
  const router = useRouter()
  const hasSyncedRef = React.useRef(false)


  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.log("FCM skipped: Firebase not configured")
      return
    }

    const setupFCM = async () => {
      if (hasSyncedRef.current) return

      // 1. Request Permission & Get Token
      const token = await getFCMToken()
      if (token) {

        // 2. Sync with Backend
        hasSyncedRef.current = true
        await makeRequest({
          payload: { fcm_token: token },
          apiEndpoint: PostEndpointUrl.UpdateFCMToken,
          showToast: false,
          showErrorToast: false
        })
      }
    }

    const timeoutId = setTimeout(setupFCM, 3000)

    // 3. Listen for Foreground Messages
    if (!messaging) return;
    
    const unsubscribe = onMessage(messaging, (payload: any) => {
      console.log("Foreground Message received:", payload)
      
      const title = payload.notification?.title || payload.data?.title || "New Notification"
      const body = payload.notification?.body || payload.data?.body || ""
      const icon = payload.notification?.icon || payload.data?.icon
      const type = payload.data?.type
      const threadId = payload.data?.thread_id
      const typeId = payload.data?.type_id

      let redirectUrl = ""
      if (type === 'chat' || type === 'chat_reaction' || type === 'chat_comment') {
        redirectUrl = `/app/chat/${threadId}`
      } else if (type === 'task' || type === 'task_comment') {
        redirectUrl = `/app/tasks/${threadId}`
      } else if (type === 'channel' || type === 'post_comment') {
        redirectUrl = `/app/channel/${typeId}/${threadId}`
      }

      toast({
        title: (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {icon && <AvatarImage src={icon} alt={title} />}
              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <span className="font-semibold">{title}</span>
          </div>
        ) as any,
        description: body,
        action: redirectUrl ? (
          <ToastAction 
            altText="View" 
            onClick={() => router.push(redirectUrl)}
          >
            View
          </ToastAction>
        ) : undefined,
      })
    });

    return () => {
      clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [makeRequest])

  return null // Headless component
}
