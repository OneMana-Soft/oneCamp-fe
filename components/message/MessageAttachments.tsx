import {ATTACHMENT_MAX_IMAGE_GRID_SIZE, AttachmentMediaReq} from "@/types/attachment";
import {useMemo, useState} from "react";
import {useCanHover} from "@/hooks/useCanHover";
import {isRenderable} from "@/lib/utils/isRenderable";
import {cn} from "@/lib/utils/cn";
import {ConditionalWrap} from "@/components/conditionalWrap/conditionalWrap";
import {MessageAttachmentCard} from "@/components/message/MessageAttachmentCard";
import {FileTypeIcon} from "@/components/fileIcon/fileTypeIcon";
import {truncateFileName} from "@/lib/utils/truncateFileName";
import {useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {downloadFile} from "@/lib/utils/downloafFIle";

interface MessageAttachmentProps {
    attachments:  AttachmentMediaReq[];
    mediaGetUrl: string
    attachmentSelected: (at: AttachmentMediaReq) => void
}

export const MessageAttachments = ({attachmentSelected, attachments, mediaGetUrl}:MessageAttachmentProps) => {


    const { renderables, nonRenderables } = useMemo(() => {
        const renderables: AttachmentMediaReq[] = []
        const nonRenderables: AttachmentMediaReq[] = []

        attachments.forEach((attachment) => {
            if (isRenderable(attachment)) {
                renderables.push(attachment)
            } else {
                nonRenderables.push(attachment)
            }
        })

        return { renderables, nonRenderables }
    }, [attachments])

    if (!attachments.length) return null


    return (

            <div
                className={cn(
                    'flex md:w-1/3 md:max-w-4xl items-start justify-start w-auto mb-4'
                )}
            >
                <div className={cn('md:shrink-0', )} />

                <div
                    className={cn('relative flex flex-col justify-start gap-1')}
                >

                    {renderables?.length > 0 && (
                        <div className='flex gap-0.5'>
                            {renderables.slice(0, ATTACHMENT_MAX_IMAGE_GRID_SIZE).map((attachment, index) => {
                                const only = renderables.length === 1
                                const overflow = index ===  ATTACHMENT_MAX_IMAGE_GRID_SIZE - 1 && renderables.length >  ATTACHMENT_MAX_IMAGE_GRID_SIZE
                                const aspectRatio = (attachment.attachment_width || 1) / (attachment.attachment_height || 1)

                                return (
                                    <div
                                        key={attachment.attachment_uuid}
                                        className={cn('bg-elevated relative flex-1 rounded-lg', {
                                            'max-h-[44rem]': only
                                        })}
                                        style={{ aspectRatio }}
                                    >
                                        <div className='pointer-events-none absolute inset-0 z-[1] rounded-lg ring-1 ring-inset ring-[--border-primary]' />

                                        <ConditionalWrap
                                            condition={overflow}
                                            wrap={(c) => (
                                                <div className='bg-quaternary absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg'>
                                                    <div className='pointer-events-none relative z-[1] text-base'>
                                                        +{renderables.length - (ATTACHMENT_MAX_IMAGE_GRID_SIZE - 1)}
                                                    </div>
                                                    <div className='absolute inset-0 opacity-30 blur-[10px]'>{c}</div>
                                                </div>
                                            )}
                                        >
                                            <button
                                                onClick={() => attachmentSelected(attachment)}
                                                className='flex h-full w-full items-start justify-start overflow-hidden rounded-lg'
                                            >
                                                <MessageAttachmentCard attachment={attachment} autoplay={false} mediaGetURL={mediaGetUrl}/>
                                            </button>
                                        </ConditionalWrap>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {nonRenderables.map((attachment) => (
                        <NonRenderableAttachment key={attachment.attachment_uuid} attachment={attachment} attachmentLength={attachments.length} mediaGetUrl={mediaGetUrl}/>
                    ))}


                </div>
            </div>
    )
}

interface NonRenderableAttachmentProps {
    attachment: AttachmentMediaReq
    attachmentLength: number
    mediaGetUrl: string
}

function NonRenderableAttachment({ attachment, attachmentLength, mediaGetUrl }: NonRenderableAttachmentProps) {
    const mediaReq = useMediaFetch<GetMediaURLRes>(attachment?.attachment_uuid ? mediaGetUrl +'/'+attachment.attachment_uuid : '')

    const download = () => {
        if (mediaReq.data?.url) {
            downloadFile(mediaReq.data.url,attachment.attachment_file_name)
        }
    }

    return (
        <button
            onClick={download}
            className={cn('flex items-center gap-2 self-start rounded-lg border py-2 pl-2 pr-3')}
        >
            <FileTypeIcon  name={attachment.attachment_file_name} fileType={attachment.attachment_raw_type}/>

            <div
                className={cn(
                    ' line-clamp-2 text-center font-mono md:line-clamp-3 text-xs',
                    attachmentLength > 2 && 'max-sm:hidden',
                    attachmentLength > 1 && 'max-xs:hidden'
                )}
            >
                {truncateFileName(attachment.attachment_file_name)}
            </div>
        </button>
    )
}