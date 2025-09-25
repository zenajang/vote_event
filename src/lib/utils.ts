import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function regionNameByLocale(code: string) {
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
    return dn.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}
