"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import {cn} from "@/lib/utils/helpers/cn";

export const ChatSkeleton = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col h-full bg-background"
    >
      {/* Header Skeleton */}
      <motion.div variants={item} className="flex items-center space-x-4 p-3 border-b">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
        <div className="ml-auto flex space-x-2">
           <Skeleton className="h-8 w-8 rounded-md" />
           <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </motion.div>

      {/* Messages Skeleton */}
      <div className="flex-1 p-4 space-y-6 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div 
            key={i} 
            variants={item}
            className={`flex items-start space-x-3 }`}
          >
              <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />

              <div className="flex-1 space-y-2">
                  {/* Name and Time */}
                  <div className="flex items-baseline space-x-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-12" />
                  </div>

                  {/* Message Body - Random widths for realism */}
                  <div className="space-y-1">
                      <Skeleton className="h-4 w-[90%]" />
                      <Skeleton className={cn("h-4", i % 2 === 0 ? "w-[70%]" : "w-[40%]")} />
                  </div>
              </div>
          </motion.div>
        ))}
      </div>

      {/* Input Skeleton */}
      <motion.div variants={item} className="p-4 border-t">
        <Skeleton className="h-14 w-full rounded-xl" />
      </motion.div>
    </motion.div>
  )
}

export const GenericSkeleton = () => {
    return (
        <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-[200px]" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
            </div>
            <div className="pt-4 grid grid-cols-3 gap-4">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
            </div>
        </div>
    )
}
