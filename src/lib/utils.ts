import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toFullWidth(str?: string) {
  str = str?.replace(/[A-Za-z0-9!?]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
  });
  return str;
}

export function sortByName<T extends { name?: string }>(a: T, b: T) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }

  // names must be equal
  return 0;
}