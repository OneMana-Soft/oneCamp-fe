"use client"

import { useRef, useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Portal } from "@radix-ui/react-portal";


interface VideoPlayerProps {
    url: string
    fileName: string
}

export default function VideoPlayer({ url, fileName}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [playbackRate, setPlaybackRate] = useState(1)

    // Control visibility timer
    useEffect(() => {
        let timer: NodeJS.Timeout

        const handleMouseMove = () => {
            setShowControls(true)
            clearTimeout(timer)
            timer = setTimeout(() => {
                if (isPlaying) {
                    setShowControls(false)
                }
            }, 3000)
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener("mousemove", handleMouseMove)
            container.addEventListener("mouseleave", () => {
                if (isPlaying) {
                    setShowControls(false)
                }
            })
        }

        return () => {
            clearTimeout(timer)
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove)
            }
        }
    }, [isPlaying])

    // Handle video events
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const onTimeUpdate = () => setCurrentTime(video.currentTime)
        const onDurationChange = () => setDuration(video.duration)
        const onEnded = () => setIsPlaying(false)
        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)

        video.addEventListener("timeupdate", onTimeUpdate)
        video.addEventListener("durationchange", onDurationChange)
        video.addEventListener("ended", onEnded)
        video.addEventListener("play", onPlay)
        video.addEventListener("pause", onPause)

        return () => {
            video.removeEventListener("timeupdate", onTimeUpdate)
            video.removeEventListener("durationchange", onDurationChange)
            video.removeEventListener("ended", onEnded)
            video.removeEventListener("play", onPlay)
            video.removeEventListener("pause", onPause)
        }
    }, [])

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange)
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
        }
    }, [])

    const togglePlay = () => {
        const video = videoRef.current
        if (!video) return

        if (isPlaying) {
            video.pause()
        } else {
            video.play()
        }
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return

        setIsMuted(!isMuted)
        video.muted = !isMuted
    }

    const handleVolumeChange = (value: number[]) => {
        const video = videoRef.current
        if (!video) return

        const newVolume = value[0]
        setVolume(newVolume)
        video.volume = newVolume

        if (newVolume === 0) {
            setIsMuted(true)
            video.muted = true
        } else if (isMuted) {
            setIsMuted(false)
            video.muted = false
        }
    }

    const handleSeek = (value: number[]) => {
        const video = videoRef.current
        if (!video) return

        video.currentTime = value[0]
    }

    const toggleFullscreen = () => {
        if (!containerRef.current) return

        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen()
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
    }

    const skip = (seconds: number) => {
        const video = videoRef.current
        if (!video) return

        video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds))
    }

    const changePlaybackRate = (rate: number) => {
        const video = videoRef.current
        if (!video) return

        setPlaybackRate(rate)
        video.playbackRate = rate
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full bg-black aspect-video"
            onDoubleClick={toggleFullscreen}
            onClick={togglePlay}
        >
            <video ref={videoRef} src={url} className="w-full h-full" onClick={(e) => e.stopPropagation()} />

            {showControls && (
                <div
                    className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/50 via-transparent to-black/50"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Top bar */}
                    <div className="p-4 flex justify-between items-center">
                        <div className="text-white font-medium truncate">{fileName}</div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                    <Settings className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" >
                                <DropdownMenuItem onClick={() => changePlaybackRate(0.5)}>
                                    {playbackRate === 0.5 ? "✓ " : ""}0.5x
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changePlaybackRate(1)}>
                                    {playbackRate === 1 ? "✓ " : ""}1x (Normal)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changePlaybackRate(1.5)}>
                                    {playbackRate === 1.5 ? "✓ " : ""}1.5x
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changePlaybackRate(2)}>
                                    {playbackRate === 2 ? "✓ " : ""}2x
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Bottom controls */}
                    <div className="p-4 space-y-2">
                        <Slider
                            value={[currentTime]}
                            min={0}
                            max={duration || 100}
                            step={0.1}
                            onValueChange={handleSeek}
                            className="cursor-pointer"
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => skip(-10)} className="text-white hover:bg-white/20">
                                    <SkipBack className="h-5 w-5" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        togglePlay()
                                    }}
                                    className="text-white hover:bg-white/20"
                                >
                                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                </Button>

                                <Button variant="ghost" size="icon" onClick={() => skip(10)} className="text-white hover:bg-white/20">
                                    <SkipForward className="h-5 w-5" />
                                </Button>

                                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-2 group">
                                    <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                                        {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                    </Button>

                                    <div className="w-20 hidden group-hover:block">
                                        <Slider
                                            value={[isMuted ? 0 : volume]}
                                            min={0}
                                            max={1}
                                            step={0.01}
                                            onValueChange={handleVolumeChange}
                                        />
                                    </div>
                                </div>

                                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

