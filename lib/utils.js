import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn = دمج الكلاسات مع بعض + حل التضارب بينهم
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
