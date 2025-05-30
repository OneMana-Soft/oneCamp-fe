'use client';

import {FileImage, FileText, FileAudio2, FileVideo, File, X, Play} from 'lucide-react';
import Image from 'next/image';
import {useEffect, useState} from "react";
import { AttachmentType} from "@/types/attachment";
import {getVideoThumbnail} from "@/lib/utils/getVideoThumbnail";
import {useFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {useMedia} from "@/context/MediaQueryContext";

type ConditionalIconProps = {
    fileName: string;
    progress: number;
    fileKey: string;
    getUrl?: string;
    attachmentOnCLick: (key: string) => void;
    removeFile: () => void;
    attachmentType: AttachmentType

};

const UploadingAttachmentIcon = ({
                                     fileName,
                                     progress,
                                     getUrl,
                                     fileKey,
                                     removeFile,
                                     attachmentOnCLick,
                                    attachmentType,
                                 }: ConditionalIconProps) => {

    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)

    const {isDesktop } = useMedia();

    const mediaRes = useFetch<GetMediaURLRes>(getUrl ? getUrl : '')

    useEffect( () => {
        if(attachmentType == 'video' && mediaRes.data?.url) {
            getVideoThumbnail(mediaRes.data?.url)
                .then((res)=>{
                    setThumbnailUrl(res)
                })

        }

    },[mediaRes.data?.url, attachmentType])

    const renderIcon = () => {
        if (mediaRes.data?.url) {
            switch (attachmentType) {
                case 'image':
                    return (
                        <Image
                            src={mediaRes.data?.url}
                            className='w-10 h-10 m-1 rounded-lg'
                            alt={fileName}
                            width={40}
                            height={40}
                        />
                    );
                case 'document':
                    return <FileText className='w-10 h-10 m-1 rounded-lg' />;
                case 'audio':
                    return <FileAudio2 className='w-10 h-10 m-1 rounded-lg' />;

                case 'video':
                    return thumbnailUrl ? (
                        <div className='relative '>
                            <Image
                                src={thumbnailUrl}
                                className='w-10 h-10 m-1 rounded-lg'
                                alt={fileName}
                                width={40}
                                height={40}
                            />
                            <Play size={16} className='absolute top-[30%]  left-[30%]'/>
                        </div>

                    ) : (
                        <FileVideo className='w-10 h-10 m-1 rounded-lg' />
                    );
                default:
                    return <File className='w-10 h-10 m-1 rounded-lg' />;
            }
        }

        switch (attachmentType) {
            case 'image':
                return <FileImage className='w-10 h-10 m-1 rounded-lg' />;
            case 'document':
                return <FileText className='w-10 h-10 m-1 rounded-lg' />;
            case 'audio':
                return <FileAudio2 className='w-10 h-10 m-1 rounded-lg' />;
            case 'video':
                return <FileVideo className='w-10 h-10 m-1 rounded-lg' />;
            default:
                return <File className='w-10 h-10 m-1 rounded-lg' />;
        }
    };

    return (
        <div
            className="flex relative justify-center items-center m-1 mt-2 p-1 border rounded-xl border-gray-700"

        >
            <button
                className="absolute top-0 right-0 p-1 -mt-2 -mr-2 bg-background rounded-full border-gray-700 border"
                onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                }}
            >
                <X height="1rem" width="1rem" />
            </button>
            <div onClick={() => {
                attachmentOnCLick(fileKey);
            }}
            className={getUrl?"hover:cursor-pointer":""}
            >
                {renderIcon()}
            </div>
            {(isDesktop || (!getUrl) || (attachmentType == 'document') || (attachmentType == 'other')) && <div className="flex-col">
                <div className="text-ellipsis truncate max-w-40 text-xs">
                    {fileName}
                </div>
                <div className="text-ellipsis truncate max-w-40 text-xs">
                    uploading: {progress}%
                </div>
            </div>}
        </div>
    );
};

export default UploadingAttachmentIcon;