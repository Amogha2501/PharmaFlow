"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: string
  trendValue?: string
  color?: string
}

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "emerald",
}: DashboardCardProps) {
  const colorClasses = {
    emerald: "bg-emerald-800/50 text-emerald-100 border-emerald-700/50",
    blue: "bg-blue-800/50 text-blue-100 border-blue-700/50",
    orange: "bg-orange-800/50 text-orange-100 border-orange-700/50",
    purple: "bg-purple-800/50 text-purple-100 border-purple-700/50",
    red: "bg-red-800/50 text-red-100 border-red-700/50",
    slate: "bg-slate-800/50 text-slate-100 border-slate-700/50",
  }

  const bgColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.emerald

  return (
    <div className={`bg-emerald-800/50 rounded-xl border ${bgColor} p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-200 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {trend && trendValue && (
        <div className="flex items-center mt-4 pt-4 border-t border-emerald-700/50">
          {trend === "up" ? (
            <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
            {trendValue}
          </span>
          <span className="text-emerald-300 text-sm ml-1">vs last week</span>
        </div>
      )}
    </div>
  )
}