export function getGroupingId(firstUserUUID: string, secondUserUUID: string): string {
    const uuids: string[] = [firstUserUUID, secondUserUUID];
    uuids.sort();

    return uuids.join(" ");
}