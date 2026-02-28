import {UploadedFile} from "@/types/file";
import {FilePreview} from "@/components/fileUpload/filePreview";
import {Progress} from "@/components/ui/progress";


interface FileCardProps {
    file: UploadedFile;
    onView: (file: UploadedFile) => void;
}

export const FileCard = ({ file, onView }: FileCardProps) => {
    return (
        <div className="p-4 border rounded-lg space-y-2">
            <FilePreview file={file} onView={onView} />
            <div>
                <p className="text-sm truncate">{file.file.name}</p>
                {file.uploadProgress < 100 && !file.signedUrl && (
                    <Progress value={file.uploadProgress} className="mt-1" />
                )}
                {file.error && (
                    <p className="text-sm text-red-500">{file.error}</p>
                )}
            </div>
        </div>
    );
};