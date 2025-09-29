import { useState } from 'react'

import {AttachmentMediaReq} from "@/types/attachment";
import {ImageAttachmentCard} from "@/components/attachmentCard/imageAttachmentCard";
import {VideoAttachmentCard} from "@/components/attachmentCard/videoAttachmentCard";
import {useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {EyeOff, LoaderCircle} from "lucide-react";

function getApproximateAspectRatio(val: number, lim = 10) {
    let lower = [0, 1]
    let upper = [1, 0]

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const mediant = [lower[0] + upper[0], lower[1] + upper[1]]

        if (val * mediant[1] > mediant[0]) {
            if (lim < mediant[1]) {
                return upper
            }
            lower = mediant
        } else if (val * mediant[1] == mediant[0]) {
            if (lim >= mediant[1]) {
                return mediant
            }
            if (lower[1] < upper[1]) {
                return lower
            }
            return upper
        } else {
            if (lim < mediant[1]) {
                return lower
            }
            upper = mediant
        }
    }
}

function attachmentShouldCover(attachment: AttachmentMediaReq) {
    if(!attachment.attachment_width || !attachment.attachment_height) return false
    if (attachment.attachment_type != 'video') return false

    const approximateAspectRatio = getApproximateAspectRatio(attachment.attachment_width / attachment.attachment_height)
    const approximatelyVideo = [
        [16, 9],
        [4, 3],
        [3, 2],
        [2, 1]
    ]
    const shouldCover = approximatelyVideo.some((aspectRatio) => {
        return approximateAspectRatio[0] === aspectRatio[0] && approximateAspectRatio[1] === aspectRatio[1]
    })

    return shouldCover
}

interface Props {
    attachment: AttachmentMediaReq
    autoplay?: boolean
    mediaGetURL: string
}

export function MessageAttachmentCard({ mediaGetURL, attachment, autoplay }: Props) {
    const cover = attachmentShouldCover(attachment)

    const mediaReq = useMediaFetch<GetMediaURLRes>(attachment?.attachment_uuid ? mediaGetURL +'/'+attachment.attachment_uuid : '')


    if (mediaReq.isError) {
        return (
            <div className='bg-secondary text-tertiary flex h-full w-full items-center justify-center'>
                <EyeOff size={32} />
            </div>
        )
    }

    if (mediaReq.isLoading || !mediaReq.data?.url) {
        return (
            <div
                className='bg-secondary text-tertiary flex w-full items-center justify-center'
                style={{
                    aspectRatio: `${attachment.attachment_width} / ${attachment.attachment_height}`,
                    minHeight: '100px', // Ensure a minimum height so it's not invisible
                }}
            >
                <LoaderCircle className=" animate-spin" size={32} />
            </div>
        )
    }


    if (attachment.attachment_type == 'image') {
        return <ImageAttachmentCard attachment={attachment} selfSize cover url={mediaReq.data?.url}/>
    }

    if (attachment.attachment_type == 'video') {
        return (
            <div
                className='relative flex max-h-[44rem] w-full items-center justify-center'
                style={{ aspectRatio: `${attachment.attachment_width} / ${attachment.attachment_height}` }}
            >

                <VideoAttachmentCard selfSize attachment={attachment} cover={cover} autoplay={autoplay} url={mediaReq.data?.url}/>
            </div>
        )
    }

    return null
}

export function Accessory({ label }: { label: string }) {
    return (
        <div className='dark:bg-elevated rounded-md bg-black px-2 py-1 text-center font-mono text-[11px] text-xs font-semibold text-white'>
            {label}
        </div>
    )
}
