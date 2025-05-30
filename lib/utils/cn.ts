import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export const categorizeChannelLastActivityDate = (dateStr: string) => {
  const inputDate = new Date(dateStr);
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  if (inputDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (inputDate >= startOfWeek && inputDate < today) {
    return "This Week";
  } else if (inputDate >= startOfLastWeek && inputDate < startOfWeek) {
    return "Last Week";
  } else if (inputDate >= startOfMonth && inputDate < today) {
    return "This Month";
  } else if (inputDate >= startOfLastMonth && inputDate < startOfMonth) {
    return "Last Month";
  } else {
    return "Older";
  }
};