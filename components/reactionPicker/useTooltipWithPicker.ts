"use client"

import {useCallback, useState} from "react";

interface UseTooltipWithPickerOptions {
    onExternalPopupStateChange?: (open: boolean) => void
}

export function useTooltipWithPicker(options?: UseTooltipWithPickerOptions) {
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [pickerOpen, setPickerOpen] = useState(false)
    const [suppressUntilLeave, setSuppressUntilLeave] = useState(false)

    const onTooltipChange = useCallback((open: boolean) => {
        if ((pickerOpen || suppressUntilLeave) && open) return
        setTooltipOpen(open)
    }, [pickerOpen, suppressUntilLeave])

    const onPickerOpenChange = useCallback((open: boolean) => {
        setPickerOpen(open)
        if (options?.onExternalPopupStateChange) options.onExternalPopupStateChange(open)
        if (open) {
            setTooltipOpen(false)
            setSuppressUntilLeave(true)
        }
    }, [options])

    const onSelect = useCallback(() => {
        setTooltipOpen(false)
        setSuppressUntilLeave(true)
    }, [])

    const onTriggerMouseLeave = useCallback(() => {
        setSuppressUntilLeave(false)
    }, [])

    return {
        tooltipOpen,
        onTooltipChange,
        onPickerOpenChange,
        onSelect,
        onTriggerMouseLeave,
    }
}


