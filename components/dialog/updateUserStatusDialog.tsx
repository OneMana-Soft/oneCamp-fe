"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as React from "react";
import {ReactionPicker} from "@/components/reactionPicker/reactionPicker";
import {useCallback, useMemo, useState} from "react";
import {OrganizationsOrgSlugMembersMeStatusesPostRequest} from "@/types/status";
import {useFetch} from "@/hooks/useFetch";
import {StatusTime, UserProfileInterface, UserStatusRespInterface} from "@/types/user";
import { uniqueBy } from 'remeda'
import {useStatusIsExpired} from "@/hooks/useStatusIsExpired";
import {GetEndpointUrl} from "@/services/endPoints";
import {isStandardReaction} from "@/lib/utils/reaction/checker";
import {Input} from "@/components/ui/input";
import {useMedia} from "@/context/MediaQueryContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {getTimeRemaining} from "@/lib/utils/status/memberStatus";
import {Checkbox} from "@/components/ui/checkbox";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";
import CustomExpirationCalendarDialog from "@/components/dialog/customExpirationCalendarDialog";
import {addHours} from "date-fns";


const DEFAULT_STATUSES: OrganizationsOrgSlugMembersMeStatusesPostRequest[] = [
  {
    emoji: '🥪',
    message: 'Lunch',
    expiration_setting: '30m'
  },
  {
    emoji: '🗓️',
    message: 'In a meeting',
    expiration_setting: '1h'
  },
  {
    emoji: '🧠',
    message: 'Deep work',
    expiration_setting: '4h'
  },
  {
    emoji: '😷',
    message: 'Sick',
    expiration_setting: 'today'
  },
  {
    emoji: '🌴',
    message: 'Vacationing',
    expiration_setting: 'this_week'
  }
]



interface updateUserStatusDialogProps {
  dialogOpenState: boolean;
  setOpenState: (state: boolean) => void;
  userUUID: string;
}

const UpdateUserStatusDialog: React.FC<updateUserStatusDialogProps> = ({
  dialogOpenState,
  setOpenState,
}) => {

  const defaultState = {
    emoji: '💬',
    message: '',
    expiration_setting: '30m' as StatusTime,
    expires_at: undefined,
    pause_notifications: false
  }

  const selfProfile = useFetch<UserProfileInterface>(GetEndpointUrl.SelfProfile)
  const memberStatus = selfProfile.data?.data.user_status
  const memberStatusIsExpired = useStatusIsExpired(memberStatus)
  const recentStatusesResp = useFetch<UserStatusRespInterface>("zxzxzxzx")
  const currentStatus = memberStatusIsExpired ? null : memberStatus

  const [emoji, setEmoji] = useState(currentStatus?.emoji ?? defaultState.emoji)
  const [message, setMessage] = useState(currentStatus?.message ?? defaultState.message)
  const [expiresIn, setExpiresIn] = useState<StatusTime | null>(
      currentStatus?.expiration_setting ?? defaultState.expiration_setting
  )
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(
      currentStatus?.expires_at ? new Date(currentStatus.expires_at) : defaultState.expires_at
  )
  const [customExpirationCalendarDialogOpen, setCustomExpirationCalendarDialogOpen] = useState(false)

  const [willPauseNotifications, setWillPauseNotifications] = useState<boolean>(
      (selfProfile.data?.data?.user_notifications_paused && currentStatus?.pause_notifications) ?? defaultState.pause_notifications
  )
  const hasStatus = Boolean(currentStatus)
  const isExpirationDirty = hasStatus
      ? (expiresIn === 'custom' && expiresAt?.toISOString() !== currentStatus?.expires_at) ||
      expiresIn !== currentStatus?.expiration_setting
      : expiresAt || expiresIn !== defaultState.expiration_setting
  const isWillPauseNotificationsDirty = hasStatus
      ? selfProfile.data?.data.user_notifications_paused && currentStatus?.pause_notifications
          ? !willPauseNotifications
          : willPauseNotifications
      : willPauseNotifications !== defaultState.pause_notifications

  const isEmojiDirty = hasStatus ? emoji !== currentStatus?.emoji : emoji !== defaultState.emoji
  const isMessageDirty = hasStatus ? message !== currentStatus?.message : message !== defaultState.message
  const isDirty = isEmojiDirty || isMessageDirty || isExpirationDirty || isWillPauseNotificationsDirty

  const { isMobile } = useMedia()

  const suggestedStatuses = useMemo(() => {
    const presets = [
      ...(recentStatusesResp.data?.data?.filter((status) => status.expiration_setting !== 'custom') ?? []),
      ...DEFAULT_STATUSES
    ]

    return uniqueBy(presets, (preset) => preset.message)
        .slice(0, 5)
        .reverse()
  }, [recentStatusesResp.data])

  function onSave() {
    if (isDirty) {
      if (!currentStatus) {
        if (!expiresIn) return
        // createStatus.mutate({
        //   org: `${scope}`,
        //   emoji,
        //   message,
        //   expiration_setting: expiresIn,
        //   expires_at: expiresIn === 'custom' ? expiresAt?.toISOString() : undefined,
        //   pause_notifications: willPauseNotifications
        // })
      } else {
        // updateStatus.mutate({
        //   org: `${scope}`,
        //   emoji: isEmojiDirty ? emoji : undefined,
        //   message: isMessageDirty ? message : undefined,
        //   expiration_setting: isExpirationDirty && expiresIn ? expiresIn : undefined,
        //   expires_at: expiresIn === 'custom' ? expiresAt?.toISOString() : undefined,
        //   pause_notifications: willPauseNotifications
        // })
      }

      closeModal()
    }
  }


  function resetStateToDefaults() {
    setEmoji(defaultState.emoji)
    setMessage(defaultState.message)
    setExpiresIn(defaultState.expiration_setting)
    setExpiresAt(defaultState.expires_at)
    setWillPauseNotifications(defaultState.pause_notifications)
  }

  const timeRemaining = getTimeRemaining(currentStatus?.expires_at)

  const closeModal = useCallback(() => {
    setOpenState(false)
    setCustomExpirationCalendarDialogOpen(false);
  }, [setOpenState])

  return (
      <>
    <Dialog onOpenChange={closeModal} open={dialogOpenState}>
      {/*<DialogTrigger asChild>*/}
      {/*    <Button variant="secondary">Save</Button>*/}
      {/*</DialogTrigger>*/}
      <DialogContent className="max-w-[95vw] md:max-w-[30vw] ">
        <DialogHeader>
          <DialogTitle className='text-start'>Status</DialogTitle>
          <DialogDescription >
          </DialogDescription>
        </DialogHeader>
        <div className='scrollbar-hide flex max-h-[40vh] flex-1 flex-col  px-2 py-3'>
          {suggestedStatuses?.map((preset) => (
              <Button
                  variant='ghost'
                  key={`${preset.message}`}
                  className=' flex h-10 cursor-pointer justify-start gap-1.5 rounded-lg px-2 py-3 text-sm'
                  onClick={() => {
                    if (currentStatus) {
                      // updateStatus.mutate({
                      //   org: `${scope}`,
                      //   emoji: preset.emoji,
                      //   message: preset.message,
                      //   expiration_setting: preset.expiration_setting,
                      //   pause_notifications: willPauseNotifications
                      // })
                    } else {
                      // createStatus.mutate({
                      //   org: `${scope}`,
                      //   emoji: preset.emoji,
                      //   message: preset.message,
                      //   expiration_setting: preset.expiration_setting,
                      //   pause_notifications: willPauseNotifications
                      // })
                    }

                    setEmoji(preset.emoji)
                    setMessage(preset.message)
                    setExpiresIn(preset.expiration_setting)

                    closeModal()
                  }}
              >
                <span className='flex h-6 w-6 items-center justify-center text-center font-["emoji"]'>
                  {preset.emoji}
                </span>
                <span className='line-clamp-1'>{preset.message}</span>
                <span className='text-muted-foreground text-sm'>{preset.expiration_setting.replace('_', ' ')}</span>
              </Button>
          ))}
        </div>
        <Separator
            orientation="horizontal"
            className=""
        />
        <div className='flex flex-col gap-3  '>
          <div className='relative'>
            <div className='absolute left-1.5 top-1.5 z-[100]'>
              <ReactionPicker
                  onReactionSelect={(reaction) => {
                    if (!isStandardReaction(reaction)) return

                    setEmoji(reaction.native)
                  }}
                  showCustomReactions={false}
              >
                <Button
                    variant='ghost'
                    // accessibilityLabel='Update status emoji'
                    className='group/emoji'
                    size={'icon'}
                >
                <span className='text-lg'>{emoji}</span>
              </Button>
            </ReactionPicker>
          </div>
            <Input
                autoFocus={!isMobile}
                value={message}
                onChange={(e)=>{setMessage(e.target.value)}}
                placeholder='What’s your status?'
                className='bg-transparent rounded-md text-[15px] h-12 dark:bg-transparent pl-12 pr-24'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    onSave()
                  }
                }}
            />
            {message && (
                <div className='absolute right-1.5 top-1.5 '>



                  <Select onValueChange={(value) => {

                    if (value === 'custom') {
                      setCustomExpirationCalendarDialogOpen(true)
                      return
                    }
                    setExpiresIn(value as StatusTime)
                    setExpiresAt(defaultState.expires_at)
                  }}
                  defaultValue={'30m'}
                          value={expiresIn ?? '30m'}
                  >
                    <SelectTrigger className="mr-2 decoration-0 border-0" aria-hidden={false}>
                      <SelectValue aria-hidden={false}>
                        {expiresIn && expiresIn === 'custom'
                        ? getTimeRemaining(expiresAt?.toISOString())
                        : (expiresIn?.replace('_', ' ') ?? timeRemaining)}</SelectValue >
                    </SelectTrigger>
                    <SelectContent aria-hidden={false}>
                        <SelectItem value="30m">30m</SelectItem>
                        <SelectItem value="1h">1h</SelectItem>
                        <SelectItem value="4h">4h</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="this_week">This Week</SelectItem>
                        <SelectItem value="custom" aria-hidden={false} >Custom</SelectItem>
                    </SelectContent>
                  </Select>

                </div>
            )}
          </div>

          <div className='flex items-start justify-between'>
            <div className='mt-1.5 flex flex-1 items-center gap-1'>
              <div className='flex flex-1 justify-between gap-3'>
                <div className='flex items-center gap-1'>
                  <Checkbox checked={willPauseNotifications} onCheckedChange={(c) => {
                    setWillPauseNotifications(c as boolean)
                  }}/>
                  <label className='ml-2 font-medium'>
                    Pause notifications
                  </label>


                </div>
                {willPauseNotifications && (

                  <Link href='/me/settings#notification-schedule' className='text-blue-500 hover:underline'>
                    {selfProfile.data?.data.user_custom_notification?.type === 'none' ? 'Set up a schedule' : 'Edit schedule'}
                  </Link>

                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="!flex-row">
          <div className='flex-1'>
            <Button variant='secondary' onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div>
            {hasStatus && !isDirty && (
                <Button
                    onClick={() => {
                      // deleteStatus.mutate({ org: `${scope}` })
                      resetStateToDefaults()
                      closeModal()
                    }}
                >
                  Clear current status
                </Button>
            )}

            {(isDirty || !hasStatus) && (
                <Button
                    onClick={onSave}
                    // disabled={updateStatus.isPending || !isDirty || !message}
                    disabled={ !isDirty || !message}
                >
                  Update status
                </Button>
            )}

          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        <CustomExpirationCalendarDialog
            dialogOpenState={customExpirationCalendarDialogOpen}
            setOpenState={setCustomExpirationCalendarDialogOpen}
            initialDate={expiresAt ?? addHours(new Date(), 1)}
            onChange={(date) => {
              setExpiresIn('custom')
              setExpiresAt(date)
            }}
        />
        </>
  );
};

export default UpdateUserStatusDialog;
