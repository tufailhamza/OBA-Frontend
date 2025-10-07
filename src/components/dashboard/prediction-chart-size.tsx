import { Card, CardContent } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Legend } from "recharts"
import { useState, useEffect } from "react"
import { searchByContractSizePlanId } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Base distribution data for contract size (similar to timing but for dollar amounts)
const baseSizeDistributionData = [
  { x: -3, y: 0.003 },
  { x: -2.5, y: 0.015 },
  { x: -2, y: 0.045 },
  { x: -1.5, y: 0.120 },
  { x: -1, y: 0.235 },
  { x: -0.5, y: 0.340 },
  { x: 0, y: 0.385 },
  { x: 0.5, y: 0.340 },
  { x: 1, y: 0.235 },
  { x: 1.5, y: 0.120 },
  { x: 2, y: 0.045 },
  { x: 2.5, y: 0.015 },
  { x: 3, y: 0.003 }
]

interface ProbabilityDistributionChartSizeProps {
  planId?: string;
}

export function ProbabilityDistributionChartSize({ planId }: ProbabilityDistributionChartSizeProps) {
  const [predictedContractSize, setPredictedContractSize] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch predicted contract size when planId changes
  useEffect(() => {
    if (!planId) {
      setPredictedContractSize(null)
      return
    }

    const fetchPrediction = async () => {
      setLoading(true)
      try {
        const result = await searchByContractSizePlanId(planId)
        if (result.found && result.contract_size_predictions.length > 0) {
          setPredictedContractSize(result.contract_size_predictions[0].predicted_contract_size)
        }
      } catch (error) {
        console.error("Contract Size prediction error:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch contract size prediction",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPrediction()
  }, [planId, toast])

  // Generate contract size labels based on predicted value
  const generateContractSizeLabels = (predictedSize: number) => {
    // Standard deviation for contract size (similar to timing but for dollar amounts)
    const stdDev = predictedSize * 0.3 // 30% of predicted size as standard deviation
    
    return [
      Math.max(0, predictedSize - 3 * stdDev), // -3σ
      Math.max(0, predictedSize - 2 * stdDev), // -2σ
      Math.max(0, predictedSize - 1 * stdDev), // -1σ
      predictedSize, // μ (mean)
      predictedSize + 1 * stdDev, // +1σ
      predictedSize + 2 * stdDev, // +2σ
      predictedSize + 3 * stdDev  // +3σ
    ]
  }

  // Format contract size for display
  const formatContractSize = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    } else {
      return `$${amount.toFixed(0)}`
    }
  }

  const contractSizeLabels = predictedContractSize ? generateContractSizeLabels(predictedContractSize) : []
  const sizeDistributionData = baseSizeDistributionData

  if (loading) {
    return (
      <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-80">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading contract size prediction...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!predictedContractSize) {
    return (
      <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-lg font-medium text-muted-foreground">Enter a Plan ID to view contract size distribution</p>
            <p className="text-sm text-muted-foreground">Use the search box in the Contract Timing tab to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
      <CardContent className="p-6">
        <div className="h-80 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sizeDistributionData}>
              <defs>
                <linearGradient id="sizeDistributionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="x" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value, index) => {
                  // Show contract size labels on bottom X-axis
                  if (contractSizeLabels.length > 0) {
                    if (value === -3) return formatContractSize(contractSizeLabels[0])
                    if (value === -2) return formatContractSize(contractSizeLabels[1])
                    if (value === -1) return formatContractSize(contractSizeLabels[2])
                    if (value === 0) return formatContractSize(contractSizeLabels[3]) // Mean
                    if (value === 1) return formatContractSize(contractSizeLabels[4])
                    if (value === 2) return formatContractSize(contractSizeLabels[5])
                    if (value === 3) return formatContractSize(contractSizeLabels[6])
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
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                fill="url(#sizeDistributionGradient)"
              />
              <ReferenceLine x={0} stroke="hsl(var(--accent))" strokeDasharray="5 5" />
              <ReferenceLine x={-1} stroke="hsl(var(--success))" strokeDasharray="3 3" />
              <ReferenceLine x={1} stroke="hsl(var(--success))" strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        
        <div className="flex justify-center items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-muted-foreground">Mean (μ) - Highest Probability</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-muted-foreground">±1 Standard Deviation (σ)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent/30"></div>
            <span className="text-muted-foreground">Distribution Curve</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Key Statistical Properties - Contract Size</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-accent/10 rounded-lg p-4 border-l-4 border-accent">
              <p className="text-lg font-bold text-accent">68.3% of data</p>
              <p className="text-sm text-muted-foreground">within ±1 standard deviation</p>
            </div>
            <div className="bg-success/10 rounded-lg p-4 border-l-4 border-success">
              <p className="text-lg font-bold text-success">95.4% of data</p>
              <p className="text-sm text-muted-foreground">within ±2 standard deviations</p>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 border-l-4 border-warning">
              <p className="text-lg font-bold text-warning">99.7% of data</p>
              <p className="text-sm text-muted-foreground">within ±3 standard deviations</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}