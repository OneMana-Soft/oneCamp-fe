import Image from 'next/image';
import { AudioPlayer } from './AudioPlayer';
import {UploadedFile} from "@/types/file";
import {getFileType} from "@/lib/utils/file/getFileType";
import {Button} from "@/components/ui/button";

interface FilePreviewProps {
    file: UploadedFile;
    onView: (file: UploadedFile) => void;
}

export const FilePreview = ({ file, onView }: FilePreviewProps) => {
    const fileType = getFileType(file.file.type);

    switch (fileType) {
        case 'image':
            return (
                <div
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onView(file)}
                >
                    <Image
                        src={file.signedUrl || file.preview}
                        alt={file.file.name}
                        width={100}
                        height={100}
                        className="object-cover rounded"
                    />
                </div>
            );
        case 'video':
            return (
                <video
                    controls
                    width={200}
                    src={file.signedUrl || file.preview}
                    className="rounded"
                />
            );
        case 'audio':
            return <AudioPlayer url={file.preview} />;
        case 'pdf':
        case 'text':
            return (
                <Button
                    variant="outline"
                    onClick={() => onView(file)}
                    disabled={!file.signedUrl}
                >
                    View {file.file.name}
                </Button>
            );
        default:
            return <span className="text-sm">{file.file.name}</span>;
    }
};