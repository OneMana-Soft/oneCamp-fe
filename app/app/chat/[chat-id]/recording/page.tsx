"use client";


import {useParams} from "next/navigation";
import { ChatRecording } from "@/components/chat/ChatRecording";

export default function Page() {
  const params = useParams()
  const chatId = params?.["chat-id"] as string

  if (!chatId) {
    return null
  }

  return <ChatRecording chatId={chatId}/>;
}
