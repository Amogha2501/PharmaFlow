"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendValue?: string
  color?: "emerald" | "blue" | "orange" | "purple" | "red" | "slate"
}

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "emerald",
}: DashboardCardProps) {
  
  const themes = {
    emerald: {
      bg: "bg-emerald-800/50",
      border: "border-emerald-700/50",
      text: "text-emerald-100",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-300",
      subText: "text-emerald-200",
      trendUp: "text-emerald-400",
    },
    blue: {
      bg: "bg-blue-800/50",
      border: "border-blue-700/50",
      text: "text-blue-100",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-300",
      subText: "text-blue-200",
      trendUp: "text-blue-400",
    },
    orange: {
      bg: "bg-orange-800/50",
      border: "border-orange-700/50",
      text: "text-orange-100",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-300",
      subText: "text-orange-200",
      trendUp: "text-orange-400",
    },
    purple: {
      bg: "bg-purple-800/50",
      border: "border-purple-700/50",
      text: "text-purple-100",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-300",
      subText: "text-purple-200",
      trendUp: "text-purple-400",
    },
    red: {
      bg: "bg-red-800/50",
      border: "border-red-700/50",
      text: "text-red-100",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-300",
      subText: "text-red-200",
      trendUp: "text-red-400",
    },
    slate: {
      bg: "bg-slate-800/50",
      border: "border-slate-700/50",
      text: "text-slate-100",
      iconBg: "bg-slate-500/20",
      iconColor: "text-slate-300",
      subText: "text-slate-200",
      trendUp: "text-slate-400",
    },
  }

  const t = themes[color] || themes.emerald

  return (
    <div
      className={`
        rounded-xl border p-6 shadow-md h-full 
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
        ${t.bg} ${t.border} ${t.text}
      `}
    >
      {/* FIX: Changed to Grid Layout. 
          '1fr' gives text remaining space. 'auto' keeps icon fixed. 
      */}
      <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
        
        {/* Text Section */}
        <div className="min-w-0">
          <p className={`text-sm font-medium mb-1 leading-tight break-words ${t.subText}`}>
            {title}
          </p>
          <p className="text-2xl font-bold text-white break-all">
            {value}
          </p>
        </div>

        {/* Icon Section */}
        <div 
          className={`
            flex items-center justify-center rounded-lg
            h-10 w-10 ${t.iconBg} ${t.iconColor}
          `}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trend && trendValue && (
        <div className={`flex items-center mt-4 pt-4 border-t ${t.border}`}>
          {trend === "up" ? (
            <TrendingUp className={`w-4 h-4 mr-1 ${t.trendUp}`} />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
          )}
          <span
            className={`text-sm font-medium ${
              trend === "up" ? t.trendUp : "text-red-400"
            }`}
          >
            {trendValue}
          </span>
          <span className={`text-sm ml-1 ${t.subText}`}>vs last week</span>
        </div>
      )}
    </div>
  )
}