export const getVideoThumbnail = (
    videoUrl: string,
    timestamp: number = 1, // Default to 1 second
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Canvas context not supported'));
            return;
        }

        video.src = videoUrl;
        video.crossOrigin = 'anonymous'; // If video is from a different origin
        video.currentTime = timestamp; // Set to desired timestamp in seconds

        video.onloadeddata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg');
            resolve(thumbnail);
        };

        video.onerror = () => {
            reject(new Error('Failed to load video'));
        };
    });
};