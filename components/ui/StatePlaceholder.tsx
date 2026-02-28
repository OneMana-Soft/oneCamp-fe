"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, AlertCircle, Search, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/helpers/cn';

interface StatePlaceholderProps {
  type: 'empty' | 'error' | 'search';
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  action?: React.ReactNode;
}

const config = {
  empty: {
    icon: Inbox,
    color: 'text-muted-foreground',
    bg: 'bg-muted/10',
  },
  error: {
    icon: AlertCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/5',
  },
  search: {
    icon: Search,
    color: 'text-primary',
    bg: 'bg-primary/5',
  }
};

export function StatePlaceholder({ 
  type, 
  title, 
  description, 
  icon: CustomIcon, 
  className,
  action 
}: StatePlaceholderProps) {
  const Icon = CustomIcon || config[type].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/60",
        config[type].bg,
        className
      )}
    >
      <div className={cn("p-4 rounded-full mb-4", config[type].bg)}>
        <Icon className={cn("h-10 w-10", config[type].color)} />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-[280px] mb-6">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </motion.div>
  );
}
