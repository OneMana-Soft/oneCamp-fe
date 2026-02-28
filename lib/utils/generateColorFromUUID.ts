/**
 * Generates a modern, consistent color from a UUID
 * Colors work well in both light and dark modes
 */
export function generateColorFromUUID(uuid: string): string {
    // Modern color palette that looks great in light & dark modes
    const colors = [
        "#3B82F6", // Blue
        "#8B5CF6", // Purple
        "#EC4899", // Pink
        "#F59E0B", // Amber
        "#10B981", // Emerald
        "#06B6D4", // Cyan
        "#EF4444", // Red
        "#6366F1", // Indigo
        "#14B8A6", // Teal
        "#F97316", // Orange
        "#7C3AED", // Violet
        "#0EA5E9", // Sky
    ]

    // Simple hash function to convert UUID to a number
    let hash = 0
    for (let i = 0; i < uuid.length; i++) {
        const char = uuid.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash // Convert to 32bit integer
    }

    // Use absolute value and modulo to get index
    const index = Math.abs(hash) % colors.length
    return colors[index]
}
