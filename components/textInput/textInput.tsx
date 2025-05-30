'use client'

import * as React from "react";
import {useEffect, useState, useRef} from "react";
import { EditorContent } from "@tiptap/react";
import { Content, Editor } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { SectionTwo } from "@/components/minimal-tiptap/components/section/two";
import { SectionFour } from "@/components/minimal-tiptap/components/section/four";
import { SectionFive } from "@/components/minimal-tiptap/components/section/five";
import { LinkBubbleMenu } from "@/components/minimal-tiptap/components/bubble-menu/link-bubble-menu";
import {
  useMinimalTiptapEditor,
  UseMinimalTiptapEditorProps,
} from "@/components/minimal-tiptap/hooks/use-minimal-tiptap";

import "@/components/minimal-tiptap/styles/index.css";
import { LetterCaseCapitalizeIcon} from "@radix-ui/react-icons";
import ToolbarButton from "@/components/minimal-tiptap/components/toolbar-button";
import {useMedia} from "@/context/MediaQueryContext";
import {LucideIcon, Paperclip, X} from "lucide-react";

export interface MinimalTiptapProps
    extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content;
  isOutputText?: boolean;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
  attachmentOnclick?: ()=>void
  buttonLabel?: string;
  children?: React.ReactNode
  ButtonIcon?: LucideIcon
  buttonOnclick?: () => Promise<void> | void;
  secondaryButtonLabel?: string;
  secondaryButtonOnclick?: () => Promise<void> | void;
}

const Toolbar = ({ editor, toggledTextEditor, setToggledTextEditor }: { editor: Editor, toggledTextEditor: boolean,  setToggledTextEditor: (b: boolean)=>void}) => {


  const {isMobile, isDesktop} = useMedia()


  return (
      <div className="shrink-0 overflow-x-auto  p-2">
        <div className="flex w-max items-center gap-px justify-between">
          {/*<SectionOne editor={editor} activeLevels={[1, 2, 3]} variant="outline" />*/}
          {/*<Separator orientation="vertical" className="mx-2 h-7" />*/}


          {(isMobile && !toggledTextEditor) ?
              <ToolbarButton
                  tooltip="Text color"
                  aria-label="Text color"
                  className="w-12"
                  variant={"outline"}
                  onClick={()=>{setToggledTextEditor(true)}}
              >
                <LetterCaseCapitalizeIcon className="size-5"/>

              </ToolbarButton>
              :
              <>
                {
                  isMobile && <Button size='icon' variant='ghost' onClick={()=>{setToggledTextEditor(false)}}><X/></Button>
                }
                <SectionTwo
                    editor={editor}
                    activeActions={["italic", "bold", "code", "strikethrough"]}
                    mainActionCount={4}
                    variant="outline"
                />
                <Separator orientation="vertical" className="mx-2 h-7"/>
                <SectionFour
                    editor={editor}
                    activeActions={["bulletList", "orderedList"]}
                    mainActionCount={2}
                    variant="outline"
                />


                {isDesktop && <><Separator orientation="vertical" className="mx-2 h-7"/>
                <SectionFive
                    editor={editor}
                    activeActions={["blockquote", "codeBlock", "horizontalRule"]}
                    mainActionCount={3}
                    variant="outline"
                /></>}


              </>



          }
        </div>

      </div>
  )

};

export const MinimalTiptapTextInput = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
    (
        {
          value,
            isOutputText,
          onChange,
          className,
          buttonLabel,
          ButtonIcon,
          buttonOnclick,
          secondaryButtonLabel,
          secondaryButtonOnclick,
          editable,
          children,
            attachmentOnclick,
            editorContentClassName,
          content,
          ...props
        },
        ref
    ) => {
      const editor = useMinimalTiptapEditor({
        value,
        onUpdate: onChange,
        ...props,
      });

      const divRef = useRef<HTMLDivElement>(null);

        const {isMobile} = useMedia()
        const [toggledTextEditor, setToggledTextEditor] = useState(false)



        useEffect(() => {
        if (divRef.current) {
          divRef.current.addEventListener("click", handleMentionClick);
        }
        return () => {
          if (divRef.current) {
            divRef.current.removeEventListener("click", handleMentionClick);
          }
        };
      }, []);

      const handleMentionClick = (event: MouseEvent) => {
        const target = event.target as HTMLDivElement;
        if (target.classList.contains("mention")) {
          const userId = target.getAttribute("data-id")?.split("@")[0];
          if (userId) {
            // dispatch(openOtherUserProfilePopup({ userId: userId }));
          }
        }
      };

      useEffect(() => {
        if (editor) {
          const c = content as string;
          if (content !== undefined && editor.getHTML() !== c.trim()) {
            editor.commands.setContent(content || "");
          }

          editor.setEditable(editable || false);




        }
      }, [editor, content, editable]);



      if (!editor) {
        return null;
      }

      return (
          <div
              ref={ref}
              className={cn(
                  "flex  w-full flex-col  rounded-md border border-input justify-between focus-within:border-primary",
                  (isOutputText? '': 'max-h-[85vh]'),
                  className
              )}
          >
            <EditorContent
                editor={editor}
                className={cn(
                    "minimal-tiptap-editor min-h-2 overflow-y-scroll ",
                    editorContentClassName
                )}
                content={content as string}
                ref={divRef}
            />
            { editor.isEditable && (
                <div   className={isMobile?'fixed bottom-0 w-full right-0 pl-0 p-2 bg-gray-50 dark:bg-gray-900 pt-0 ':""}>
                    {children}
                  <div className="flex justify-between md:mr-2">
                    <Toolbar editor={editor} toggledTextEditor={toggledTextEditor}  setToggledTextEditor={setToggledTextEditor}/>
                    <div className="flex justify-center items-center gap-x-2">
                        {
                            attachmentOnclick && !(isMobile && toggledTextEditor) &&
                            <Button size={"icon"} variant={'ghost'} className="rounded-full" onClick={attachmentOnclick}><Paperclip /> </Button>

                        }
                      {secondaryButtonLabel && secondaryButtonOnclick && (
                          <Button onClick={secondaryButtonOnclick} variant="outline">
                            {secondaryButtonLabel}
                          </Button>
                      )}
                      {buttonLabel && buttonOnclick && (
                          <Button onClick={buttonOnclick}>{buttonLabel}</Button>
                      )}
                      {ButtonIcon && buttonOnclick && (
                          <Button size={"icon"} className="rounded-full" onClick={buttonOnclick}><ButtonIcon /></Button>
                      )}
                    </div>
                  </div>
                  <LinkBubbleMenu editor={editor} />


                </div>
            )}
          </div>
      );
    }
);

MinimalTiptapTextInput.displayName = "MinimalTiptapTask";

export default MinimalTiptapTextInput;
