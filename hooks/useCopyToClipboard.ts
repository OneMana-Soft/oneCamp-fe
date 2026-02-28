"use client"

import { useCallback, useRef, useState } from "react"
import { toast } from "@/hooks/use-toast"

export function useCopyToClipboard(timeout = 2000) {
    const [copied, setCopied] = useState(false)
    const timerRef = useRef<number | null>(null)

    const copy = useCallback(
        async (text: string, message?: string) => {
            try {
                // Prefer the async clipboard when available and in a secure context
                if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text)
                } else {
                    // Fallback: create a hidden textarea and use execCommand
                    const ta = document.createElement("textarea")
                    ta.value = text
                    ta.setAttribute("readonly", "")
                    ta.style.position = "fixed"
                    ta.style.top = "0"
                    ta.style.left = "0"
                    ta.style.opacity = "0"
                    document.body.appendChild(ta)
                    ta.focus()
                    ta.select()
                    document.execCommand("copy")
                    document.body.removeChild(ta)
                }

                setCopied(true)
                if (timerRef.current) window.clearTimeout(timerRef.current)
                timerRef.current = window.setTimeout(() => setCopied(false), timeout)

                // Show toast only if a message is provided
                if (message) {
                    toast({
                        title: "Copied",
                        description: message,
                    })
                }

                return true
            } catch (err) {
                console.error("[v0] Clipboard copy failed:", (err as Error)?.message)
                setCopied(false)
                return false
            }
        },
        [timeout],
    )

    return { copied, copy }
}
