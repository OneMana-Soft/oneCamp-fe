"use client"

import { Extension } from '@tiptap/react'

export const ResetMarksOnEnter = Extension.create({
  name: 'resetMarksOnEnter',

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        if (
          editor.isActive('bold') ||
          editor.isActive('italic') ||
          editor.isActive('strike') ||
          editor.isActive('underline') ||
          editor.isActive('code')
        ) {
          editor.commands.splitBlock({ keepMarks: false })

          return true
        }

        return false
      }
    }
  }
})
