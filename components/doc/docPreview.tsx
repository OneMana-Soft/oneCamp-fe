import React from 'react';
import { cn } from '@/lib/utils/helpers/cn';

interface DocPreviewProps {
    content: string;
    className?: string;
}

export const DocPreview: React.FC<DocPreviewProps> = ({ content, className }) => {
    // A4 Aspect Ratio is ~ 1 : 1.414
    return (
        <div className={cn("relative w-full h-full bg-gray-100/50 dark:bg-secondary/20 flex items-center justify-center p-4 overflow-hidden select-none pointer-events-none", className)}>
             {/* A4 Paper Container */}
            <div className="relative w-full max-w-[180px] aspect-[1/1.414] bg-white shadow-sm border border-gray-200 dark:border-border overflow-hidden shrink-0">
                 {/* Scaled Content - heavily scaled to fit the small A4 box */}
                <div 
                    className="origin-top-left transform scale-[0.1] w-[1000%] h-[1000%] p-20 pt-30 bg-white text-black leading-relaxed text-[50px] [&_*]:m-0 [&_*]:mt-0 [&_*]:text-black"
                    dangerouslySetInnerHTML={{ __html: content || '<div class="p-4 text-gray-300 font-medium">Empty document</div>' }}
                />
            </div>
            {/* Overlay to prevent interaction */}
            <div className="absolute inset-0 bg-transparent" />
        </div>
    );
};
