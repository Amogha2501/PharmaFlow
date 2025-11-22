"use client"

import { TrendingUp } from "lucide-react"

interface TodaysSalesCardProps {
  title: string
  value: string | number
}

export default function TodaysSalesCard({
  title,
  value,
}: TodaysSalesCardProps) {
  return (
    <div className="bg-emerald-800/50 rounded-xl border border-emerald-700/50 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md h-full">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-emerald-200 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-emerald-800/50 flex items-center justify-center flex-shrink-0" style={{ width: '36px', height: '36px' }}>
          <TrendingUp className="w-4 h-4 text-emerald-100" />
        </div>
      </div>
    </div>
  )
}