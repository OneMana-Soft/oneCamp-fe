"use client";

import {useMedia} from "@/context/MediaQueryContext";
import {DocTopBarBreadcrumb} from "@/components/doc/docTopBarBreadcrumb";
import {DocSharePopover} from "@/components/popover/docSharePopover";
import {DocCommentPopover} from "@/components/popover/docCommentPopover";
import DocOptionsDesktopTopBar from "@/components/doc/docOptionsDesktopTopBar";
import MinimalTiptapDocInput from "@/components/docEditor/docInput";
import {cn} from "@/lib/utils/cn"; // Your custom hook


function DocIdPage() {

    const { isDesktop } = useMedia();


    return (
        <div className='flex flex-col h-full'>

        {
            isDesktop &&
            <div className='h-14 items-center flex justify-between p-2 pl-4 pr-4 border-b'>
                <DocTopBarBreadcrumb/>
                <div className='flex'>
                    <DocSharePopover/>
                    <DocCommentPopover/>
                    <DocOptionsDesktopTopBar/>
                </div>
            </div>
        }
            <MinimalTiptapDocInput
                throttleDelay={3000}
                className={cn('h-full flex-1 w-full rounded-xl')}
                editorContentClassName="overflow-auto h-full p-2"
                output="json"
                onChange={value => {
                    console.log(value)
                }}
                placeholder="This is your placeholder..."
                editable={true}
                editorClassName="focus:outline-none px-5 py-4 h-full"
            />

        </div>
    );
}

export default DocIdPage;