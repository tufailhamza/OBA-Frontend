"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

const trendData = [
  { month: 'Jan', value: 2400, target: 2000 },
  { month: 'Feb', value: 1398, target: 2100 },
  { month: 'Mar', value: 9800, target: 2200 },
  { month: 'Apr', value: 3908, target: 2300 },
  { month: 'May', value: 4800, target: 2400 },
  { month: 'Jun', value: 3800, target: 2500 },
]

const pieData = [
  { name: 'Desktop', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Mobile', value: 30, color: 'hsl(var(--accent))' },
  { name: 'Tablet', value: 15, color: 'hsl(var(--success))' },
  { name: 'Other', value: 10, color: 'hsl(var(--warning))' },
]

const barData = [
  { category: 'Product A', sales: 4000, profit: 2400 },
  { category: 'Product B', sales: 3000, profit: 1398 },
  { category: 'Product C', sales: 2000, profit: 9800 },
  { category: 'Product D', sales: 2780, profit: 3908 },
  { category: 'Product E', sales: 1890, profit: 4800 },
]

export function TrendChart() {
  return (
    <Card className="shadow-card border-0 gradient-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorValue)"
              strokeWidth={3}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="hsl(var(--accent))" 
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function DistributionChart() {
  return (
    <Card className="shadow-card border-0 gradient-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name}: {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function PerformanceChart() {
  return (
    <Card className="shadow-card border-0 gradient-card col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Product Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}