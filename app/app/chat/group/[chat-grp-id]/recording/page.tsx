"use client";


import {useParams} from "next/navigation";
import { GroupChatRecording } from "@/components/chat/GroupChatRecording";

export default function Page() {
    const params = useParams()
    const grpId = params?.["chat-grp-id"] as string

    if (!grpId) {
        return null
    }

  return <GroupChatRecording grpId={grpId}/>;
}
