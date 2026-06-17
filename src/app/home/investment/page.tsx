import Link from "next/link";

import { INVESTMENT_CARD_COPY } from "@/constants/finance.constants";

export default function InvestmentDetailPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/home" className="text-sm text-slate-500 hover:text-slate-900">
        ‹ Back to overview
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {INVESTMENT_CARD_COPY.title}
      </h1>
      <p className="text-sm text-gray-500">Investment details coming soon.</p>
    </div>
  );
}
