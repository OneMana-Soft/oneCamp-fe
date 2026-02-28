export function formatDuration(seconds: number): string {
    if (!seconds || seconds < 0) return "00:00";
    
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const format = (v: number) => v < 10 ? `0${v}` : v;

    if (h > 0) {
        return `${format(h)}:${format(m)}:${format(s)}`;
    }
    return `${format(m)}:${format(s)}`;
}
