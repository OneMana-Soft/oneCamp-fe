"use client"

import {MobileTopNavigationBarFirst} from "@/components/navigationBar/mobile/mobileTopNavigationBarFirst";
import {MobileTopNavigationBarSecond} from "@/components/navigationBar/mobile/mobileTopNavigationBarSecond";
import {MobileTopNavigationBarThird} from "@/components/navigationBar/mobile/mobileTopNavigationBarThird";

export function MobileTopNavigationBar() {

    return (
        <div 
            className='w-full z-40 border-b bg-sidebar backdrop-blur'
            style={{ 
                paddingTop: 'env(safe-area-inset-top)',
                minHeight: 'calc(4rem + env(safe-area-inset-top))'
            }}
        >
            <div className='grid grid-cols-8 items-center h-full w-full pl-4 pr-4'>
                <div className='col-span-2 '><MobileTopNavigationBarFirst/></div>
                <div className='col-span-4  '><MobileTopNavigationBarSecond/></div>
                <div className='col-span-2 '><MobileTopNavigationBarThird/></div>
            </div>
        </div>


    );
}