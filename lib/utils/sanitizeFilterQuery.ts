// Allow only: letters, numbers, space, underscore, hyphen
// Note: Keep ASCII to match HTML pattern compatibility across browsers.
const ALLOWED_REGEX = /[^a-zA-Z0-9 _-]/g

// Optional: cap length for performance (avoids huge filter strings).
const MAX_LEN = 100

export function sanitizeFilterQuery(raw: string): string {
    if (!raw) return ""
    const stripped = raw.replace(ALLOWED_REGEX, "")
    // collapse multiple spaces to one and trim ends, then cap length
    return stripped
        .replace(/\s{2,}/g, " ")
        .slice(0, MAX_LEN)
}