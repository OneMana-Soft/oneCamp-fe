export type OrganizationsOrgSlugMembersMeStatusesPostRequest = {
    emoji: string
    message: string
    expiration_setting: '30m' | '1h' | '4h' | 'today' | 'this_week' | 'custom'
    expires_at?: string
    pause_notifications?: boolean
}