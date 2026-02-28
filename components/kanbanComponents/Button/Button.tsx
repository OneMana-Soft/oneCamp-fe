import React, {HTMLAttributes} from 'react';

import styles from './Button.module.css';
import {cn} from "@/lib/utils/helpers/cn";

export interface Props extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({children, ...props}: Props) {
  return (
    <button className={cn(styles.Button)} {...props}>
      {children}
    </button>
  );
}
