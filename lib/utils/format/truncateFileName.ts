import {getFileExtension} from "@/lib/utils/file/getFileExtension";

export const truncateFileName = (filename: string, maxLength = 20): string => {
    if (filename.length <= maxLength) return filename

    const extension = getFileExtension(filename)
    const nameWithoutExt = filename.slice(0, filename.lastIndexOf("."))
    const truncatedName = nameWithoutExt.slice(0, maxLength - extension.length - 4)

    return `${truncatedName}...${extension ? `.${extension}` : ""}`
}