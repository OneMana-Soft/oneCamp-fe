import React from 'react';
import {useDroppable, UniqueIdentifier} from '@dnd-kit/core';

import {droppable} from './droppable-svg';
import styles from './Droppable.module.css';
import {cn} from "@/lib/utils/helpers/cn";

interface Props {
  children: React.ReactNode;
  dragging: boolean;
  id: UniqueIdentifier;
}

export function Droppable({children, id, dragging}: Props) {
  const {isOver, setNodeRef} = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        styles.Droppable,
        isOver && styles.over,
        dragging && styles.dragging,
        children && styles.dropped
      )}
      aria-label="Droppable region"
    >
      {children}
      {droppable}
    </div>
  );
}
