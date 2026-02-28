import {MobileTopNavigationBar} from "@/components/navigationBar/mobile/mobileTopNavigationBar";
import {MobileBottomNavigationBar} from "@/components/navigationBar/mobile/mobileBottomNavigationBar";

export function MobileNavigationBar({
                                              children,
                                          }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <div className='flex flex-col h-full max-h-[100dvh] justify-between overscroll-none'>
                <MobileTopNavigationBar/>

                <div className='flex-1 overflow-y-auto'>
                    {children}

                </div>

                <MobileBottomNavigationBar />
            </div>
        </>

    );
}