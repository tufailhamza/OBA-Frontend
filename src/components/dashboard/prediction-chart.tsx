import { Card, CardContent } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Legend } from "recharts"

const distributionData = [
  { x: -3, y: 0.004, label: "-3σ", month: "Sep 2024" },
  { x: -2.5, y: 0.018, label: "", month: "Oct 2024" },
  { x: -2, y: 0.054, label: "-2σ", month: "Nov 2024" },
  { x: -1.5, y: 0.130, label: "", month: "Dec 2024" },
  { x: -1, y: 0.242, label: "-1σ", month: "Jan 2025" },
  { x: -0.5, y: 0.352, label: "", month: "Feb 2025" },
  { x: 0, y: 0.399, label: "μ", month: "Mar 2025" },
  { x: 0.5, y: 0.352, label: "", month: "Apr 2025" },
  { x: 1, y: 0.242, label: "+1σ", month: "May 2025" },
  { x: 1.5, y: 0.130, label: "", month: "Jun 2025" },
  { x: 2, y: 0.054, label: "+2σ", month: "Jul 2025" },
  { x: 2.5, y: 0.018, label: "", month: "Aug 2025" },
  { x: 3, y: 0.004, label: "+3σ", month: "Sep 2025" }
]

export function ProbabilityDistributionChart() {
  return (
    <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
      <CardContent className="p-6">
        <div className="h-80 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={distributionData}>
              <defs>
                <linearGradient id="distributionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="x" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
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
                fill="url(#distributionGradient)"
              />
              <ReferenceLine x={0} stroke="hsl(var(--primary))" strokeDasharray="5 5" />
              <ReferenceLine x={-1} stroke="hsl(var(--success))" strokeDasharray="3 3" />
              <ReferenceLine x={1} stroke="hsl(var(--success))" strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-4 px-8">
          <span>Sep 2024</span>
          <span>Nov 2024</span>
          <span>Jan 2025</span>
          <span className="font-semibold text-primary">Mar 2025</span>
          <span>May 2025</span>
          <span>Jul 2025</span>
          <span>Sep 2025</span>
        </div>
        
        <div className="flex justify-center items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Mean (μ) - Highest Probability</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-muted-foreground">±1 Standard Deviation (σ)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/30"></div>
            <span className="text-muted-foreground">Distribution Curve</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Key Statistical Properties</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-lg font-bold text-primary">71.8% of data</p>
              <p className="text-sm text-muted-foreground">within ±1 standard deviation</p>
            </div>
            <div className="bg-success/10 rounded-lg p-4 border-l-4 border-success">
              <p className="text-lg font-bold text-success">93.2% of data</p>
              <p className="text-sm text-muted-foreground">within ±2 standard deviations</p>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 border-l-4 border-warning">
              <p className="text-lg font-bold text-warning">98.9% of data</p>
              <p className="text-sm text-muted-foreground">within ±3 standard deviations</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}