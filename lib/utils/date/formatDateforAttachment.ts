import {isZeroEpoch} from "@/lib/utils/validation/isZeroEpoch";

export function formatDateForAttachment(dateString: string): string {

    if (isZeroEpoch(dateString)) return dateString;

    let date;

    // Check if it's likely an epoch timestamp (all digits)
    if (/^\d+$/.test(dateString)) {
        date = new Date(Number(dateString));
    } else {
        // Try parsing as a date string
        date = new Date(dateString);
    }

    // Validate the date
    if (isNaN(date.getTime())) return "Invalid Date";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}
