export interface UploadFileInterfaceRes {
    msg: string,
    object_uuid: string,
}

export interface GetMediaURLRes {
    msg: string
    url: string
}

export interface FileDataInterface {
    obj_uuid: string,
    src_key: string,
    src_value: string,
}


export interface UploadedFile {
    file: File;
    preview: string;
    signedUrl?: string;
    uploadProgress: number;
    error?: string;
}

export type FileType = 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'other';