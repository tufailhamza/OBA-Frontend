import { Card, CardContent } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Legend } from "recharts"
import { useState, useEffect } from "react"
import { searchByPlanId, type PlanIdSearchResponse } from "@/services/api"

// Real model statistics: Mean: 95.10 days, Std Dev: 33.66 days
const baseTimingDistributionData = [
  { x: -3, y: 0.001, label: "-3σ", days: 11 },
  { x: -2.5, y: 0.004, label: "", days: 25 },
  { x: -2, y: 0.011, label: "-2σ", days: 28 },
  { x: -1.5, y: 0.030, label: "", days: 45 },
  { x: -1, y: 0.070, label: "-1σ", days: 61 },
  { x: -0.5, y: 0.130, label: "", days: 78 },
  { x: 0, y: 0.200, label: "μ", days: 95 },
  { x: 0.5, y: 0.130, label: "", days: 112 },
  { x: 1, y: 0.070, label: "+1σ", days: 129 },
  { x: 1.5, y: 0.030, label: "", days: 145 },
  { x: 2, y: 0.011, label: "+2σ", days: 162 },
  { x: 2.5, y: 0.004, label: "", days: 179 },
  { x: 3, y: 0.001, label: "+3σ", days: 196 }
]

// Helper function to convert days to months from a base date
const convertDaysToMonths = (days: number, baseDate: Date = new Date()) => {
  const targetDate = new Date(baseDate)
  targetDate.setDate(targetDate.getDate() + days)
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  const month = months[targetDate.getMonth()]
  const year = targetDate.getFullYear()
  
  return `${month} ${year}`
}

// Helper function to get current date for reference
const getCurrentDate = () => {
  const now = new Date()
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  return `${months[now.getMonth()]} ${now.getFullYear()}`
}

interface ProbabilityDistributionChartTimingProps {
  planId?: string; // Plan ID to fetch predicted date
}

export function ProbabilityDistributionChartTiming({ planId }: ProbabilityDistributionChartTimingProps) {
  const [timingDistributionData, setTimingDistributionData] = useState(baseTimingDistributionData)
  const [monthLabels, setMonthLabels] = useState<string[]>([])
  const [predictedDate, setPredictedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPredictedDate = async () => {
      if (!planId) {
        // Use current date as fallback
        const baseDate = new Date()
        generateMonthLabels(baseDate)
        return
      }

      setLoading(true)
      try {
        const result = await searchByPlanId(planId)
        if (result?.found && result.procurement_date_predictions?.[0]?.predicted_date) {
          const date = new Date(result.procurement_date_predictions[0].predicted_date)
          setPredictedDate(date)
          generateMonthLabels(date)
        } else {
          // Fallback to current date
          const baseDate = new Date()
          generateMonthLabels(baseDate)
        }
      } catch (error) {
        console.error('Error fetching predicted date:', error)
        // Fallback to current date
        const baseDate = new Date()
        generateMonthLabels(baseDate)
      } finally {
        setLoading(false)
      }
    }

    const generateMonthLabels = (baseDate: Date) => {
      // Generate dynamic month labels centered around the predicted date
      // The predicted date should be at the mean (0 position), so we need to adjust the calculation
      const labels = baseTimingDistributionData.map(item => {
        // For the distribution, we want to show months around the predicted date
        // The mean (95 days) should correspond to the predicted date
        // So we calculate: predicted_date + (item.days - 95) to center around predicted date
        const adjustedDays = item.days - 95 // Center around predicted date
        return convertDaysToMonths(adjustedDays, baseDate)
      })
      setMonthLabels(labels)
      
      // Update data with month information
      const updatedData = baseTimingDistributionData.map((item, index) => ({
        ...item,
        month: labels[index],
        description: `${item.days} days (${labels[index]})`
      }))
      setTimingDistributionData(updatedData)
    }

    fetchPredictedDate()
  }, [planId])

  return (
    <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
      <CardContent className="p-6">

        <div className="h-80 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timingDistributionData}>
              <defs>
                <linearGradient id="timingDistributionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="x" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value, index) => {
                  // Show month labels on bottom X-axis
                  if (monthLabels.length > 0) {
                    if (value === -3) return monthLabels[0]
                    if (value === -2) return monthLabels[2]
                    if (value === -1) return monthLabels[4]
                    if (value === 0) return monthLabels[6] // Mean
                    if (value === 1) return monthLabels[8]
                    if (value === 2) return monthLabels[10]
                    if (value === 3) return monthLabels[12]
                  }
                  return '' // Hide other ticks
                }}
                ticks={[-3, -2, -1, 0, 1, 2, 3]} // Only show ticks at standard deviation positions
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Probability Density', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: 'hsl(var(--muted-foreground))' } }}
              />
              <Area
                type="monotone"
                dataKey="y"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#timingDistributionGradient)"
              />
              <ReferenceLine x={0} stroke="hsl(var(--primary))" strokeDasharray="5 5" />
              <ReferenceLine x={-1} stroke="hsl(var(--success))" strokeDasharray="3 3" />
              <ReferenceLine x={1} stroke="hsl(var(--success))" strokeDasharray="3 3" />
              <ReferenceLine x={-2} stroke="hsl(var(--warning))" strokeDasharray="2 2" />
              <ReferenceLine x={2} stroke="hsl(var(--warning))" strokeDasharray="2 2" />
              <ReferenceLine x={-3} stroke="hsl(var(--destructive))" strokeDasharray="1 1" />
              <ReferenceLine x={3} stroke="hsl(var(--destructive))" strokeDasharray="1 1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        
        <div className="flex justify-center items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Mean (μ)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-muted-foreground">±1σ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-muted-foreground">±2σ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span className="text-muted-foreground">±3σ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/30"></div>
            <span className="text-muted-foreground">Distribution Curve</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Key Statistical Properties - Contract Timing</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-lg font-bold text-primary">68.3% of data</p>
              <p className="text-sm text-muted-foreground">within ±1 standard deviation (33.66 days)</p>
            </div>
            <div className="bg-success/10 rounded-lg p-4 border-l-4 border-success">
              <p className="text-lg font-bold text-success">95.4% of data</p>
              <p className="text-sm text-muted-foreground">within ±2 standard deviations (67.32 days)</p>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 border-l-4 border-warning">
              <p className="text-lg font-bold text-warning">99.7% of data</p>
              <p className="text-sm text-muted-foreground">within ±3 standard deviations (100.98 days)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
