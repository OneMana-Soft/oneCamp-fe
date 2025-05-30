export interface FlatItem<T> {
    type: "separator" | "item";
    date?: string;
    data?: T;
}

export interface VirtualizedListProps<T> {
    items: FlatItem<T>[];
    renderItem: (item: T) => React.ReactNode;
    getDateHeading: (date: string) => string;
    containerClassName?: string;
}