import {cn} from "@/lib/utils/cn";
import {AttachmentMediaReq} from "@/types/attachment";


interface Props {
    attachment: AttachmentMediaReq
    selfSize?: boolean
    cover?: boolean
    autoplay?: boolean
    maxHeight?: `${number}rem`
    url?: string

}

export function VideoAttachmentCard({ url, attachment, selfSize, cover = false, autoplay = true, maxHeight }: Props) {

    return (
        <video
            key={attachment.attachment_uuid}
            muted
            loop={(attachment.attachment_duration || 0 )< 60000} // loop if less than one minute
            controls={true}
            preload='metadata'
            draggable={false}
            playsInline
            autoPlay={autoplay}
            className={cn('relative max-w-full', {
                'h-full max-h-[44rem]': selfSize && !maxHeight,
                'max-h-full': !selfSize && !maxHeight,
                'h-full w-full object-cover': cover,
                'object-contain': !cover
            })}
            style={{
                width: selfSize ? attachment.attachment_width : undefined,
                maxHeight
            }}
        >
            <source src={`${url}#t=0.1`} type={attachment.attachment_file_name} />
            <source src={`${url}#t=0.1`} />
        </video>
    )
}
