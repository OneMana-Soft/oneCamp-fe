// components/file-upload/AudioPlayer.tsx
import { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";

interface AudioPlayerProps {
    url: string;
}

export const AudioPlayer = ({ url }: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(1);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Update playback rate when speed changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = speed;
        }
    }, [speed]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const prog = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(prog);
        }
    };

    return (
        <div className="space-y-2">
            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
            />
            <div className="flex items-center gap-2">
                <Button size="sm" onClick={togglePlay} disabled={!url}>
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </Button>
                <Progress value={progress} className="w-32" />
                <select
                    value={speed}
                    onChange={(e) => {
                        const newSpeed = parseFloat(e.target.value);
                        setSpeed(newSpeed);
                    }}
                    className="text-sm"
                    disabled={!url}
                >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                </select>
            </div>
        </div>
    );
};