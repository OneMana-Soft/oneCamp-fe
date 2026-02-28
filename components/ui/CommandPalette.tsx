"use client"

import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Plus,
  Search,
  Hash,
  FolderKanban,
  CheckSquare,
  FileText
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useDispatch } from "react-redux"
import { openUI } from "@/store/slice/uiSlice"
import { useRouter } from "next/navigation"
import { useFetch } from "@/hooks/useFetch"
import { GetEndpointUrl } from "@/services/endPoints"
import { GenericResponseSchema } from "@/lib/validations/schemas"
import { z } from "zod"

const GlobalSearchResponseSchema = GenericResponseSchema.extend({
  data: z.object({
    page: z.array(z.any()).optional().default([]),
    has_more: z.boolean().optional().default(false)
  }).nullable().optional()
})

type GlobalSearchResult = {
  type: string
  comment?: any
  chat?: any
  post?: any
  attachment?: any
  task?: any
  doc?: any
  user?: any
  project?: any
  team?: any
  channel?: any
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const dispatch = useDispatch()
  const router = useRouter()

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: searchResults } = useFetch<{ data: { page: GlobalSearchResult[] } }>(
    debouncedSearch.length >= 3 ? `${GetEndpointUrl.GlobalSearch}${debouncedSearch}` : "",
    GlobalSearchResponseSchema as any
  )

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    setSearch("")
    command()
  }, [])

  const getResultTitle = (res: GlobalSearchResult) => {
    switch (res.type) {
      case 'task': return res.task.task_name
      case 'post': return res.post.post_body.substring(0, 50)
      case 'chat': return res.chat.chat_body.substring(0, 50)
      case 'doc': return res.doc.doc_title
      case 'project': return res.project.project_name
      case 'team': return res.team.team_name
      case 'user': return res.user.user_full_name || res.user.user_name
      case 'channel': return res.channel.ch_name
      case 'comment': return res.comment.comment_body.substring(0, 50)
      default: return "Unknown Result"
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckSquare className="mr-2 h-4 w-4" />
      case 'post': return <Hash className="mr-2 h-4 w-4" />
      case 'chat': return <Smile className="mr-2 h-4 w-4" />
      case 'doc': return <FileText className="mr-2 h-4 w-4" />
      case 'project': return <FolderKanban className="mr-2 h-4 w-4" />
      case 'team': return <User className="mr-2 h-4 w-4" />
      case 'comment': return <Smile className="mr-2 h-4 w-4" />
      default: return <Search className="mr-2 h-4 w-4" />
    }
  }

  const handleResultSelect = (res: GlobalSearchResult) => {
    switch (res.type) {
      case 'task': runCommand(() => router.push(`/app/task/${res.task.task_id}`)); break
      case 'post': runCommand(() => router.push(`/app/channel/${res.post.post_ch_id}/${res.post.post_id}`)); break
      case 'chat': runCommand(() => router.push(`/app/chat/${res.chat.chat_by_user_id}`)); break
      case 'doc': runCommand(() => router.push(`/app/doc/${res.doc.doc_uuid}`)); break
      case 'project': runCommand(() => router.push(`/app/project/${res.project.project_uuid}`)); break
      case 'team': runCommand(() => router.push(`/app/team/${res.team.team_uuid}`)); break
      case 'channel': runCommand(() => router.push(`/app/channel/${res.channel.ch_id}`)); break
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Type a command or search..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {searchResults?.data?.page && searchResults.data.page.length > 0 && (
          <CommandGroup heading="Search Results">
            {searchResults.data.page.map((res, i) => (
              <CommandItem key={`${res.type}-${i}`} onSelect={() => handleResultSelect(res)}>
                {getResultIcon(res.type)}
                <span className="truncate">{getResultTitle(res)}</span>
                <CommandShortcut className="capitalize">{res.type}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push("/app"))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Search Records</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => dispatch(openUI({ key: 'createChannel' })))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create Channel</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => dispatch(openUI({ key: 'createTask' })))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create Task</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/app/channel"))}>
            <Hash className="mr-2 h-4 w-4" />
            <span>Channels</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/project"))}>
            <FolderKanban className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/task"))}>
            <CheckSquare className="mr-2 h-4 w-4" />
            <span>Tasks</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/doc"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Documents</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => dispatch(openUI({ key: 'selfUserProfile' })))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
