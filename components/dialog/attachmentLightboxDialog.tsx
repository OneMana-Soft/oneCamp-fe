  "use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Download, FileIcon } from "lucide-react"
import {AttachmentDocument, AttachmentMediaReq, AttachmentType} from "@/types/attachment";
import {useFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {formatFileSizeForAttachment} from "@/lib/utils/formatFileSizeForAttachment";
import {formatDateForAttachment} from "@/lib/utils/formatDateforAttachment";
import VideoPlayer from "@/components/attachments/videoPlayer";
import {AudioPlayer} from "@/components/fileUpload/AudioPlayer";
import DocumentViewer from "@/components/attachments/documentViewer";
import {useMedia} from "@/context/MediaQueryContext";

interface MediaLightboxProps {
    media: AttachmentMediaReq
    setOpenState: (b: boolean) => void
    dialogOpenState: boolean
    allMedia: AttachmentMediaReq[]
    mediaGetUrl: string
}

export function MediaLightboxDialog({ media, dialogOpenState, allMedia, mediaGetUrl, setOpenState}: MediaLightboxProps) {
    const [currentMedia, setCurrentMedia] = useState<AttachmentMediaReq>({} as AttachmentMediaReq)
    const mediaReq = useFetch<GetMediaURLRes>(currentMedia?.attachment_uuid ? mediaGetUrl +'/'+currentMedia.attachment_uuid : '')

    const currentIndex = allMedia?.findIndex((m) => m.attachment_uuid === currentMedia?.attachment_uuid) || 0
    const { isMobile } = useMedia();


    useEffect(() => {
        if(media) {

            setCurrentMedia(media)

        }

    }, [media]);
    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") handlePrevious()
            if (e.key === "ArrowRight") handleNext()
            if (e.key === "Escape") closeModal()
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [currentIndex])


    if (!currentMedia || allMedia?.length == 0) {
        return
    }


    const handlePrevious = () => {
        const prevIndex = (currentIndex - 1 + allMedia.length) % allMedia.length
        setCurrentMedia(allMedia[prevIndex])
    }

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % allMedia.length
        setCurrentMedia(allMedia[nextIndex])
    }

    const renderAsPerAttachmentType = (attachmentString: AttachmentType, fileName: string) => {

        switch (attachmentString) {
            case 'image':
                return (<div className="relative h-full w-full">
                    <Image
                        src={mediaReq.data?.url || "/placeholder.svg"}
                        alt={fileName}
                        fill
                        sizes="90vw"
                        className="object-contain"
                    />
                </div>)

            case 'video':
                return (<VideoPlayer url={mediaReq.data?.url || ''} fileName={fileName}/>)

            case 'audio':
                return (<AudioPlayer url={mediaReq.data?.url || ''}/>)

            case 'document':
                const extension = fileName.split('.').pop() as AttachmentDocument;
                if(isMobile) {
                    return (<div className="flex flex-col items-center justify-center">
                        <FileIcon className="md:h-24 md:w-24 h-16 w-16 text-muted-foreground mb-4"/>
                        <p className="md:text-lg font-medium overflow-ellipsis truncate">{currentMedia?.attachment_file_name}</p>
                    </div>)
                }
                return (<DocumentViewer url={mediaReq.data?.url || ''} type={extension}/>)

            case 'other':
                return (<div className="flex flex-col items-center justify-center">
                    <FileIcon className="md:h-24 md:w-24 h-16 w-16 text-muted-foreground mb-4"/>
                    <p className="text-lg font-medium">{currentMedia?.attachment_file_name}</p>
                </div>)


        }
    }

    const closeModal = () => {

        setOpenState(false);
    };

    return (
        <Dialog onOpenChange={closeModal} open={dialogOpenState}>
            <DialogContent className="max-w-[95vw] md:max-w-[70vw]">
                <DialogHeader>
                    <DialogTitle ></DialogTitle>
                    <DialogDescription >
                    </DialogDescription>
                </DialogHeader>
                <div className="relative flex flex-col h-[90vh]">


                    <div className="flex-1 flex items-center justify-center md:p-4 relative">
                        {renderAsPerAttachmentType(currentMedia?.attachment_type || 'other', currentMedia?.attachment_file_name || 'unknown')}

                        {allMedia.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handlePrevious}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="p-4 border-t bg-background">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium md:text-lg overflow-ellipsis truncate max-w-[40vw]">{currentMedia?.attachment_file_name}</h3>
                                <div className="text-sm text-muted-foreground">
                                    {formatFileSizeForAttachment(currentMedia?.attachment_size||1)} • {formatDateForAttachment(currentMedia?.attachment_created_at||'')}
                                </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <a href={mediaReq.data?.url} download={currentMedia?.attachment_file_name} className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    <span>Download</span>
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

