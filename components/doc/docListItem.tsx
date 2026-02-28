import React from "react";
import {FileText} from "lucide-react";
import {formatTimeForPostOrComment} from "@/lib/utils/date/formatTimeForPostOrComment";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";

interface DocItemProps {
    docName: string;
    docCreatedBy: string;
    docCreatedAt: string;
    userSelected: boolean
}

export const DocListItem: React.FC<DocItemProps> = ({
                                                       docName,
                                                       docCreatedBy,
                                                       docCreatedAt,
                                                       userSelected,
                                                   }) => {

    const rightPanelState = useSelector((state: RootState) => state.rightPanel.rightPanelState);

    return (
        <div className={`flex pl-2 pr-4 p-2 border-b-slate-300 pt-6 pb-4 hover:cursor-pointer rounded-lg hover:bg-primary/5 hover:shadow-xl  w-full ${userSelected ? "bg-primary/5": ""}`}>
            <div className="relative">
                <FileText className="h-4 w-4" stroke='#616060'/>
            </div>
            <div className="ml-2 flex-1 flex flex-col ">
                <div className="flex justify-between items-center">
                    <div
                        className=" font-medium overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[15ch] text-sm">
                        {`${docName}`}
                    </div>
                    {docCreatedAt && <div className={`text-xs text-gray-500 overflow-ellipsis overflow-hidden whitespace-nowrap ${rightPanelState.isOpen ? 'max-w-[8ch]' : ''}`}>{formatTimeForPostOrComment(docCreatedAt)}</div>}
                </div>
                <div className="flex flex-row mt-0.5">
                    <div className="flex-1 flex items-center text-sm w-12">
                         <div className="mr-1 whitespace-nowrap text-muted-foreground text-xs">By {docCreatedBy}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
