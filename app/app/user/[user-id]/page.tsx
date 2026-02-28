"use client"

import { useParams } from "next/navigation";
import { MobileOtherUserProfile } from "@/components/profile/mobileOtherUserProfile";

export default function MobileUserProfilePage() {
    const params = useParams();
    const userUUID = params["user-id"] as string;
    return <MobileOtherUserProfile userUUID={userUUID} />;
}
