import React from 'react';

import styles from './FloatingControls.module.css';
import {cn} from "@/lib/utils/helpers/cn";

export interface Props {
  children: React.ReactNode;
}

export function FloatingControls({children}: Props) {
  return <div className={cn(styles.FloatingControls)}>{children}</div>;
}
