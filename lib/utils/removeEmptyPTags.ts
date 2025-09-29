export function removeEmptyPTags(input: string): string {
    // Regular expression to match empty <p> tags (with optional attributes)
    const emptyPTagRegex = /^(<p\b[^>]*>\s*<\/p>\s*)+|(<p\b[^>]*>\s*<\/p>\s*)+$/g;

    // Remove empty <p> tags from both start and end
    return input.trim().replace(emptyPTagRegex, '');
}