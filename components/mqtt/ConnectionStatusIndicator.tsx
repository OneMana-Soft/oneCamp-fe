"use client"

import React from "react"
import { useMqtt } from "@/components/mqtt/mqttProvider"
import { cn } from "@/lib/utils/helpers/cn"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ConnectionStatusIndicator() {
  const { connectionState } = useMqtt()
  const { isConnected, isConnecting, error } = connectionState

  let statusColor = "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"
  let statusText = "Offline"

  if (isConnected) {
    statusColor = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
    statusText = "Connected"
  } else if (isConnecting) {
    statusColor = "bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"
    statusText = "Connecting..."
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition-colors cursor-help">
            <div className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <div className={cn("relative inline-flex rounded-full h-2 w-2", statusColor)} />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider hidden md:block">
              {isConnected ? "Live" : statusText}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p className="font-semibold">{statusText}</p>
          {error && <p className="text-destructive mt-1 max-w-[200px] break-words">{error}</p>}
          <p className="text-muted-foreground mt-1 text-[10px]">Real-time connection status</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
