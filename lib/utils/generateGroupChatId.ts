import { UserProfileDataInterface} from "@/types/user";


export async function generateGroupChatId(users: UserProfileDataInterface[]): Promise<string> {
    if (!users || users.length === 0) {
        throw new Error('empty users list');
    }

    const uniqueUUIDs = new Set<string>();
    const cleanUUIDs: string[] = [];

    // Regular expression for a valid UUID (with hyphens, case-insensitive)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    for (const u of users) {
        const clean = u.user_uuid.trim().toLowerCase();

        if (clean === '') {
            continue;
        }

        if (!uuidRegex.test(clean)) {
            console.error(`invalid UUID format: ${u.user_uuid}`)
        }

        if (uniqueUUIDs.has(clean)) {
            continue; // skip duplicate
        }

        uniqueUUIDs.add(clean);
        cleanUUIDs.push(clean);
    }

    if (cleanUUIDs.length === 0) {
        console.error('no valid UUIDs provided')

    }

    // Sort lexicographically (same as sort.Strings in Go)
    cleanUUIDs.sort();

    // Join with pipe separator
    const combined = cleanUUIDs.join('|');

    // SHA-256 hash using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Return first 32 characters (same as before)
    return hashHex.slice(0, 32);
}