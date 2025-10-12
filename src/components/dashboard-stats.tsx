import * as React from 'react'
import { Dumbbell, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ReactNode
}

export function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          {changeType === 'increase' ? (
            <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-orange-500 mr-1" />
          )}
          <span className={changeType === 'increase' ? 'text-emerald-500' : 'text-orange-500'}>
            {change}
          </span>
          <span className="ml-1">from last month</span>
        </p>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard
        title="Total Workouts"
        value="24"
        change="+3"
        changeType="increase"
        icon={<Dumbbell className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Activities Logged"
        value="156"
        change="+12"
        changeType="increase"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}
