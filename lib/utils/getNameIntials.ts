export function getNameInitials(fullName: string|undefined): string {
    const nameInitialsArray = fullName?.split(" ") || [
        "Unknown",
    ];

    let nameInitial = nameInitialsArray[0][0].toUpperCase();

    if (nameInitialsArray?.length > 1) {
        nameInitial += nameInitialsArray[1][0].toUpperCase();
    }

    return nameInitial
}