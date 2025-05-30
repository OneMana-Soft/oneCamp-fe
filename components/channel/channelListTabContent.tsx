import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils/cn";
import {Search, X} from "lucide-react";
import {useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {SearchField} from "@/components/search/searchField";

// interface Item {
//     id: number;
//     title: string;
//     description: string;
//     date: string; // Date field to group items
// }


export const ChannelListTabContent = () => {

    const searchRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState("")

    const handleClear = () => {
        setInputValue("")
        searchRef.current?.focus()
    }

    // const {
    //     items,
    //     error,
    //     isLoadingInitialData,
    //     isLoadingMore,
    //     isEmpty,
    //     isReachingEnd,
    //     loadMoreRef,
    // } = useInfiniteLoad<PageData, Item>("/api/items", (pageData) => pageData.items);
    //
    // // Cache row heights to avoid recalculating
    // const rowHeights = useRef<number[]>([]);
    //
    // // Calculate dynamic row height
    // const getItemSize = (index: number) => {
    //     if (rowHeights.current[index]) {
    //         return rowHeights.current[index];
    //     }
    //
    //     const item = items[index];
    //     const baseHeight = 50; // Minimum height
    //     const descriptionHeight = Math.ceil(item.description.length / 50) * 20; // Adjust based on content
    //
    //     // Add extra height for the date divider if needed
    //     const isNewDateGroup = index === 0 || items[index - 1].date !== item.date;
    //     const dividerHeight = isNewDateGroup ? 40 : 0; // Height of the date divider
    //
    //     const height = baseHeight + descriptionHeight + dividerHeight;
    //
    //     rowHeights.current[index] = height; // Cache the height
    //     return height;
    // };
    //
    // // Reset height cache when items change
    // useEffect(() => {
    //     rowHeights.current = [];
    // }, [items]);
    //
    // // Memoize the row renderer to avoid unnecessary re-renders
    // const Row = useMemo(
    //     () =>
    //         ({ index, style }: { index: number; style: React.CSSProperties }) => {
    //             const item = items[index];
    //
    //             // Show a loading indicator at the end of the list
    //             if (index === items.length && isLoadingMore) {
    //                 return (
    //                     <div style={style} className="flex justify-center items-center">
    //                         Loading...
    //                     </div>
    //                 );
    //             }
    //
    //             // Check if this item starts a new date group
    //             const isNewDateGroup = index === 0 || items[index - 1].date !== item.date;
    //
    //             return (
    //                 <div style={style}>
    //                     {/* Render the date divider if needed */}
    //                     {isNewDateGroup && (
    //                         <div className="p-2 bg-gray-100 font-bold text-lg">
    //                             {new Date(item.date).toLocaleDateString()}
    //                         </div>
    //                     )}
    //
    //                     {/* Render the item */}
    //                     <div className="p-4 border-b">
    //                         <h3 className="font-bold">{item.title}</h3>
    //                         <p>{item.description}</p>
    //                     </div>
    //                 </div>
    //             );
    //         },
    //     [items, isLoadingMore]
    // );
    //
    // // Handle empty state
    // if (isEmpty) {
    //     return <div className="p-4 text-center">No items found.</div>;
    // }
    //
    // // Handle error state
    // if (error) {
    //     return (
    //         <div className="p-4 text-center text-red-500">
    //             Failed to load items. Please try again.
    //         </div>
    //     );
    // }

    return (
        <div>
            <SearchField onChange={setInputValue} value={inputValue} placeholder={"Search channels..."}/>


    {/*<div className="h-screen">*/
    }
    {/*    <AutoSizer>*/
    }
    {/*        {({height, width}) => (*/
    }
    {/*            <List*/
    }
    {/*                height={height}*/
    }
    {/*                width={width}*/
    }
    {/*                itemCount={items.length + (isLoadingMore ? 1 : 0)} // Add 1 for the loading indicator*/
    }
    {/*                itemSize={getItemSize} // Dynamic height function*/
    }
    {/*                estimatedItemSize={100} // Estimated average height for smoother scrolling*/
    }
    {/*            >*/
    }
    {/*                {Row}*/
    }
    {/*            </List>*/
    }
    {/*        )}*/
    }
    {/*    </AutoSizer>*/
    }

    {/*    /!* Load more trigger *!/*/
    }
    {/*    {!isReachingEnd && <div ref={loadMoreRef}/>}*/
    }
    {/*</div>*/
    }


</div>


)
    ;
}