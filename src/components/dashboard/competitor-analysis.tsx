import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { searchByCompetitorPlanId, type CompetitorAnalysisSearchResponse } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const DonutChart = ({ percentage }: { percentage: number }) => {
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
  
  return (
    <div className="relative w-8 h-8">
      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 40 40">
        {/* Background circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="transparent"
          stroke="hsl(var(--muted))"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="transparent"
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

const competitorData = [
  {
    name: "Competitor Name",
    winProbability: "65%",
    winProbabilityValue: 65,
    totalContractsValue: "$75M",
    recentContractDate: "March 2025",
    monthsAgo: "2 months ago"
  },
  {
    name: "Competitor Name", 
    winProbability: "15%",
    winProbabilityValue: 15,
    totalContractsValue: "$22M",
    recentContractDate: "September 2024",
    monthsAgo: "5 months ago"
  },
  {
    name: "Competitor Name",
    winProbability: "10%",
    winProbabilityValue: 10,
    totalContractsValue: "$7M",
    recentContractDate: "April 2025",
    monthsAgo: "1 month ago"
  }
]

interface CompetitorAnalysisProps {
  planId?: string;
}

export function CompetitorAnalysis({ planId }: CompetitorAnalysisProps) {
  const [data, setData] = useState<CompetitorAnalysisSearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!planId) {
      setData(null)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const result = await searchByCompetitorPlanId(planId)
        setData(result)
      } catch (error) {
        console.error("Competitor Analysis error:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch competitor analysis",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [planId, toast])

  const record = data?.records[0]
  const vendorPrediction = data?.vendor_predictions[0]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Procurement Opportunity Competitor Analysis</h1>
      </div>

      {/* Opportunity Overview */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-foreground">Opportunity Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Description */}
          <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary min-h-[120px] flex flex-col justify-center">
            <p className="text-lg font-bold text-primary">Project Description</p>
            <p className="text-sm text-muted-foreground line-clamp-4 overflow-hidden">
              {loading ? 'Loading...' : (record?.Services_Description || 'Enter a Plan ID in Contract Timing tab to view project details')}
            </p>
          </div>

          {/* Issuing Agency */}
          <div className="bg-success/10 rounded-lg p-6 border-l-4 border-success min-h-[120px] flex flex-col justify-center">
            <p className="text-lg font-bold text-success">Issuing Agency</p>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : (record?.Agency || 'Enter a Plan ID in Contract Timing tab to view agency details')}
            </p>
          </div>

          {/* Procurement Approach */}
          <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent min-h-[120px] flex flex-col justify-center">
            <p className="text-lg font-bold text-accent">Procurement Approach</p>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : (record?.Procurement_Method || 'Enter a Plan ID in Contract Timing tab to view procurement method')}
            </p>
          </div>

          {/* Predicted Contract Value */}
          <div className="bg-warning/10 rounded-lg p-6 border-l-4 border-warning min-h-[120px] flex flex-col justify-center">
            <p className="text-lg font-bold text-warning">Vendor Recommendations</p>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : 
                (vendorPrediction && vendorPrediction.vendor_recommendations?.length > 0 ? 
                  `${vendorPrediction.vendor_recommendations.length} vendor recommendation(s) available` : 
                  'Enter a Plan ID in Contract Timing tab to view recommendations'
                )
              }
            </p>
          </div>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-foreground">Competitor Analysis</h3>
        
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading competitor analysis...</span>
            </div>
          </div>
        ) : !data || !data.found ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <p className="text-lg font-medium text-muted-foreground">Enter a Plan ID to view competitor analysis</p>
              <p className="text-sm text-muted-foreground">Use the search box in the Contract Timing tab to get started</p>
            </CardContent>
          </Card>
        ) : vendorPrediction?.error ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <div className="bg-warning/10 rounded-lg p-6 border-l-4 border-warning">
                <p className="text-lg font-semibold text-warning mb-2">Unable to Generate Competitor Analysis</p>
                <p className="text-sm text-muted-foreground">{vendorPrediction.error}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Competitor Name</TableHead>
                  <TableHead className="font-semibold text-center">Win Probability</TableHead>
                  <TableHead className="font-semibold text-center">Total City Contracts Value</TableHead>
                  <TableHead className="font-semibold text-center">Most Recent Contract Date</TableHead>
                  <TableHead className="font-semibold text-center">Most Relevant Contract</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Sort vendor recommendations by probability */}
                {(() => {
                  const vendorRecommendations = vendorPrediction?.vendor_recommendations || []
                  
                  // If no recommendations, show empty state
                  if (vendorRecommendations.length === 0) {
                    return (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No vendor recommendations available for this procurement opportunity.
                        </TableCell>
                      </TableRow>
                    )
                  }
                  
                  // Sort by probability from highest to lowest
                  const sortedVendors = [...vendorRecommendations].sort((a, b) => b.probability - a.probability)
                  
                  // Limit to maximum 5 competitors
                  const topCompetitors = sortedVendors.slice(0, 5)
                  
                  // Calculate total probability for normalization
                  const totalProbability = topCompetitors.reduce((sum, vendor) => sum + vendor.probability, 0)
                  
                  // Normalize probabilities to sum to 100%
                  const normalizedCompetitors = topCompetitors.map(vendor => ({
                    ...vendor,
                    normalizedProbability: totalProbability > 0 ? (vendor.probability / totalProbability) * 100 : 0
                  }))
                  
                  return normalizedCompetitors.map((competitor, index) => {
                    // Format contract date
                    const contractDate = competitor.most_recent_contract_date 
                      ? new Date(competitor.most_recent_contract_date)
                      : null
                    
                    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                    const recentContractDate = contractDate 
                      ? `${monthNames[contractDate.getMonth()]} ${contractDate.getFullYear()}`
                      : 'N/A'
                    
                    // Calculate months ago
                    let monthsAgo = 'N/A'
                    if (contractDate) {
                      const now = new Date()
                      const diffTime = Math.abs(now.getTime() - contractDate.getTime())
                      const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30))
                      monthsAgo = diffMonths === 0 ? 'Less than 1 month ago' : diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`
                    }
                    
                    // Use contract amount from most_relevant_contract
                    const contractAmount = competitor.most_relevant_contract?.contract_amount || 0
                    const contractId = competitor.most_relevant_contract?.contract_id || 'N/A'
                    
                    return (
                      <TableRow key={`vendor-${index}`}>
                        <TableCell className="font-medium">
                          {competitor.vendor}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-2">
                            <DonutChart percentage={Math.round(competitor.normalizedProbability)} />
                            <span className="text-2xl font-bold text-foreground">
                              {Math.round(competitor.normalizedProbability)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-2xl font-bold text-foreground">
                            {contractAmount >= 1000000 
                              ? `$${(contractAmount / 1000000).toFixed(1)}M`
                              : contractAmount >= 1000
                              ? `$${(contractAmount / 1000).toFixed(1)}K`
                              : `$${contractAmount.toLocaleString()}`
                            }
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-lg font-semibold text-foreground">
                              {recentContractDate}
                            </div>
                            {monthsAgo !== 'N/A' && (
                              <div className="text-sm font-light text-green-600">
                                {monthsAgo}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                            {contractId}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })
                })()}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  )
}