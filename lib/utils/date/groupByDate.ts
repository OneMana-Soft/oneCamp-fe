export function groupByDate<T>(
    items: T[],
    getDate: (item: T) => string,
    sortOrder: 'asc' | 'desc' = 'asc'
): Record<string, T[]> {
    return [...items] // Create a copy of the array to avoid mutating the original
        .sort((a, b) => {
            const dateA = new Date(getDate(a)).getTime();
            const dateB = new Date(getDate(b)).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        })
        .reduce(
            (acc, item) => {
                const date = new Date(getDate(item)).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });

                if (!acc[date]) {
                    acc[date] = [];
                }

                acc[date].push(item);
                return acc;
            },
            {} as Record<string, T[]>
        );
}