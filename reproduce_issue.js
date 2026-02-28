const crypto = require('crypto');

function generateGroupChatId(users) {
    if (!users || users.length === 0) {
        throw new Error('empty users list');
    }

    const uniqueUUIDs = new Set();
    const cleanUUIDs = [];

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
    console.log("Combined string:", combined);

    // SHA-256 hash
    const hash = crypto.createHash('sha256').update(combined).digest('hex');

    // Return first 32 characters (64 hex chars total → 32 bytes → take first 16 bytes = 32 hex chars)
    return hash.slice(0, 32);
}

// Simulate CreateChatMessageDialog logic
function simulateDialog(selectedUsers, selfUser) {
    console.log("--- Simulation Start ---");
    console.log("Selected Users:", selectedUsers.map(u => u.user_uuid));
    console.log("Self User:", selfUser?.user_uuid);

    if (!selfUser) {
        console.log("No self user");
        return;
    }

    const filteredUsers = selectedUsers.filter((u) => u.user_uuid != selfUser.user_uuid)
    console.log("Filtered Users (excluding self):", filteredUsers.map(u => u.user_uuid));

    if (filteredUsers.length == 1) {
        console.log("Redirecting to DM:", '/app/chat/' + filteredUsers[0].user_uuid);
        return;
    }

    if (filteredUsers.length == 0) {
        console.log("Redirecting to Self DM:", '/app/chat/' + selfUser.user_uuid);
        return;
    }

    if (selfUser) {
        filteredUsers.push(selfUser)
    }
    console.log("Filtered Users (including self):", filteredUsers.map(u => u.user_uuid));

    const grpId = generateGroupChatId(filteredUsers)
    console.log("Generated Group ID:", grpId);
    console.log("Redirecting to Group Chat:", '/app/chat/group/' + grpId);
}

const userA = { user_uuid: 'a8635b71-17e0-4cc5-9739-f898fb458df1' };
const userB = { user_uuid: 'efc867e3-4494-4027-875a-22ca450d53cd' };
const userC = { user_uuid: '11111111-1111-1111-1111-111111111111' };

// Scenario 1: User A selects User B (DM)
simulateDialog([userB], userA);

// Scenario 2: User A selects User B and User C (Group)
simulateDialog([userB, userC], userA);

// Scenario 3: User A selects User B and User B (Duplicate)
simulateDialog([userB, userB], userA);

// Scenario 4: User A selects User B (and somehow logic fails?)
// What if filteredUsers has 2 users but one is invalid?
