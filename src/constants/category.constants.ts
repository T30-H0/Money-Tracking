import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Car,
  CircleEllipsis,
  HeartPulse,
  PartyPopper,
  ReceiptText,
  ShoppingBag,
  Utensils,
  WalletCards,
} from "lucide-react";

import type { CategoryColor, CategoryIconName } from "@/types/finance";

export const CATEGORY_ICONS = {
  utensils: Utensils,
  "receipt-text": ReceiptText,
  car: Car,
  "shopping-bag": ShoppingBag,
  "heart-pulse": HeartPulse,
  "party-popper": PartyPopper,
  "circle-ellipsis": CircleEllipsis,
  "wallet-cards": WalletCards,
  "briefcase-business": BriefcaseBusiness,
  "badge-dollar-sign": BadgeDollarSign,
} satisfies Record<CategoryIconName, typeof Utensils>;

export const CATEGORY_STYLES: Record<CategoryColor, string> = {
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  cyan: "bg-cyan-100 text-cyan-700",
  violet: "bg-violet-100 text-violet-700",
  rose: "bg-rose-100 text-rose-700",
  pink: "bg-pink-100 text-pink-700",
  slate: "bg-slate-100 text-slate-700",
  emerald: "bg-emerald-100 text-emerald-700",
  indigo: "bg-indigo-100 text-indigo-700",
  teal: "bg-teal-100 text-teal-700",
};
