"use client";


import { ChannelRecording } from "@/components/channel/channelRecording";
import {useParams} from "next/navigation";

export default function Page() {
  const params = useParams()
  const channelId = params?.["channel-id"] as string

  if (!channelId) {
    return null
  }

  return <ChannelRecording channelId={channelId}/>;
}
