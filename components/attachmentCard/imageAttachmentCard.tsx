import Image from 'next/image'
import {AttachmentMediaReq} from "@/types/attachment";
import {useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {cn} from "@/lib/utils/cn";


interface Props {
    attachment: AttachmentMediaReq
    selfSize?: boolean
    cover?: boolean
    maxHeight?: `${number}rem`
    url?: string
}

export function ImageAttachmentCard({ url, attachment, selfSize, cover = false,  maxHeight }: Props) {


    if (!url || !attachment.attachment_height || !attachment.attachment_width) { return null }


    const fallbackWidth = 500
    const fallbackHeight = 375
    const width = Math.min(attachment.attachment_width ?? fallbackWidth, fallbackWidth)
    const height = Math.min(attachment.attachment_height ?? fallbackHeight, fallbackHeight)

    return (
        <div className={cn({ 'flex h-full w-full items-center justify-center': !cover, content: cover })}>
            <Image
                alt={attachment.attachment_file_name ?? 'Image attachment'}
                src={url || "/placeholder.svg"}
                width={width}
                height={height}
                draggable={false}
                className={cn('max-w-full', {
                    'max-h-[44rem]': selfSize && !maxHeight,
                    'max-h-full': !selfSize && !maxHeight,
                    'h-full object-cover': cover,
                    'object-contain': !cover,
                    'object-top': cover && attachment.attachment_height > attachment.attachment_width
                })}
                style={{
                    width: selfSize ? width : '100%',
                    maxHeight
                }}
            />
        </div>
    )
}
