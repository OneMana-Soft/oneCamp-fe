import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { Content, UseEditorOptions } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { useEditor, mergeAttributes } from '@tiptap/react'
import { DOMOutputSpec } from '@tiptap/pm/model'
import { Typography } from '@tiptap/extension-typography'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Underline } from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import {
  Link,
  Image,
  HorizontalRule,
  CodeBlockLowlight,
  Selection,
  Color,
  UnsetAllMarks,
  ResetMarksOnEnter,
  FileHandler,
  mentionSuggestionOptions
} from '../extensions'
import { cn } from '@/lib/utils/helpers/cn'
import { fileToBase64, getOutput, randomId } from '../utils'
import { useThrottle } from '../hooks/use-throttle'
import { Toast, useToast } from "@/hooks/use-toast";
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { Mention } from "@tiptap/extension-mention";

import { ReactNodeViewRenderer } from '@tiptap/react'
import MentionNodeView from '../extensions/mention-list/MentionNodeView'

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
  value?: Content
  output?: 'html' | 'json' | 'text'
  placeholder?: string
  editorClassName?: string
  throttleDelay?: number
  onUpdate?: (content: Content) => void
  onBlur?: (content: Content) => void
  collaboration?: {
    enabled: boolean
    documentId: string
    token: string
    username: string
    color?: string
    onAuthenticationFailed?: () => void
    onStatus?: (status: string) => void
  }
}

const createExtensions = (placeholder: string, toast: (options: Toast) => void, collaboration?: UseMinimalTiptapEditorProps['collaboration'], provider?: HocuspocusProvider) => {
  const extensions = [
    StarterKit.configure({
      horizontalRule: false,
      codeBlock: false,
      paragraph: { HTMLAttributes: { class: 'text-node' } },
      heading: { HTMLAttributes: { class: 'heading-node' } },
      blockquote: { HTMLAttributes: { class: 'block-node' } },
      bulletList: { HTMLAttributes: { class: 'list-node' } },
      orderedList: { HTMLAttributes: { class: 'list-node' } },
      code: { HTMLAttributes: { class: 'inline', spellcheck: 'false' } },
      dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' },
      history: false // Disable history in favor of Y.js history
    }),
    Link,
    Mention.extend({
      addNodeView() {
        return ReactNodeViewRenderer(MentionNodeView)
      },
    }).configure({
      suggestion: mentionSuggestionOptions,
      HTMLAttributes: {
        class: 'mention',
      },
      renderHTML: (prop): DOMOutputSpec => {
        return['span', mergeAttributes({ class: 'mention hover:cursor-pointer' , 'data-id': prop.node.attrs.id, 'data-label': prop.node.attrs.label, 'data-type': "mention"}), `@${prop.node.attrs.label}`]
      },
    }),
    Underline,
    Image.configure({
      allowedMimeTypes: ['image/*'],
      maxFileSize: 5 * 1024 * 1024,
      allowBase64: true,
      uploadFn: async file => {
        // NOTE: This is a fake upload function. Replace this with your own upload logic.
        // This function should return the uploaded image URL.

        // wait 3s to simulate upload
        await new Promise(resolve => setTimeout(resolve, 1000))

        const src = await fileToBase64(file)

        // either return { id: string | number, src: string } or just src
        // return src;
        return { id: randomId(), src }
      },
      onToggle(editor, files, pos) {
        editor.commands.insertContentAt(
          pos,
          files.map(image => {
            const blobUrl = URL.createObjectURL(image)
            const id = randomId()

            return {
              type: 'image',
              attrs: {
                id,
                src: blobUrl,
                alt: image.name,
                title: image.name,
                fileName: image.name
              }
            }
          }), { updateSelection: false }
        )
      },
      onImageRemoved({ id, src }) {
        console.log('Image removed', { id, src })
      },
      onValidationError(errors) {
        errors.forEach(error => {
          toast({
            title: 'Image validation error',
            description: error.reason,
            variant: 'destructive'
          });

        })
      },
      onActionSuccess({ action }) {
        const mapping = {
          copyImage: 'Copy Image',
          copyLink: 'Copy Link',
          download: 'Download'
        }

        toast({
          title: mapping[action],
          description: 'Image action success',
        });

      },
      onActionError(error, { action }) {
        const mapping = {
          copyImage: 'Copy Image',
          copyLink: 'Copy Link',
          download: 'Download'
        }
        toast({
          title: `Failed to ${mapping[action]}`,
          description: error.message,
          variant: 'destructive'
        });
      }
    }),
    FileHandler.configure({
      allowBase64: true,
      allowedMimeTypes: ['image/*'],
      maxFileSize: 5 * 1024 * 1024,
      onDrop: (editor, files, pos) => {
        files.forEach(async file => {
          const src = await fileToBase64(file)
          editor.commands.insertContentAt(pos, {
            type: 'image',
            attrs: { src }
          })
        })
      },
      onPaste: (editor, files) => {
        files.forEach(async file => {
          const src = await fileToBase64(file)
          editor.commands.insertContent({
            type: 'image',
            attrs: { src }
          })
        })
      },
      onValidationError: errors => {
        errors.forEach(error => {

          toast({
            title: 'Image validation error',
            description: error.reason,
            variant: 'destructive'
          });
        })
      }
    }),
    Color,
    TextStyle,
    Selection,
    Typography,
    UnsetAllMarks,
    HorizontalRule,
    ResetMarksOnEnter,
    CodeBlockLowlight,
    Placeholder.configure({ placeholder: () => placeholder })
  ]

  if (collaboration && collaboration.enabled && provider) {
    extensions.push(
      Collaboration.configure({
        document: provider.document,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: collaboration.username,
          color: collaboration.color || '#f783ac',
        },
      })
    )
  }

  return extensions
}

export const useMinimalTiptapEditor = ({
  value,
  output = 'html',
  placeholder = '',
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  collaboration,
  ...props
}: UseMinimalTiptapEditorProps) => {
  const throttledSetValue = useThrottle((value: Content) => onUpdate?.(value), throttleDelay)
  const { toast } = useToast()
  
  const [provider, setProvider] = React.useState<HocuspocusProvider | null>(null)

  React.useEffect(() => {
    if (collaboration?.enabled && collaboration.documentId) {
       const newProvider = new HocuspocusProvider({
        url: process.env.NEXT_PUBLIC_COLLABORATION_URL || 'ws://localhost:1234',
        name: collaboration.documentId,
        token: collaboration.token, // Pass auth token
        onAuthenticationFailed: () => {
          collaboration.onAuthenticationFailed?.()
        },
        onStatus: (data) => {
          collaboration.onStatus?.(data.status)
        },
      })
      setProvider(newProvider)

      return () => {
        newProvider.destroy()
      }
    }
  }, [collaboration?.enabled, collaboration?.documentId, collaboration?.token])


  const handleUpdate = React.useCallback(
    (editor: Editor) => throttledSetValue(getOutput(editor, output)),
    [output, throttledSetValue]
  )

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty && !collaboration?.enabled) {
        editor.commands.setContent(value)
      }
    },
    [value, collaboration?.enabled] // Don't set initial content if collaboration is enabled (let Y.js sync)
  )

  const handleBlur = React.useCallback((editor: Editor) => onBlur?.(getOutput(editor, output)), [output, onBlur])

  const extensions = React.useMemo(
    () => createExtensions(placeholder, toast, collaboration, provider || undefined),
    [placeholder, toast, collaboration, provider]
  )

  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        class: cn('focus:outline-none', editorClassName)
      }
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    ...props
  }, [extensions])

  if (collaboration?.enabled && !provider) {
    return null
  }

  return editor
}

export default useMinimalTiptapEditor
