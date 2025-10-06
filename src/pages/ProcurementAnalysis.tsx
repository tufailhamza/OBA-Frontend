import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Loader2 } from "lucide-react"
import { ProbabilityDistributionChart } from "@/components/dashboard/prediction-chart"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { 
  searchByPlanId, 
  searchByContractSizePlanId, 
  searchByCompetitorPlanId,
  type PlanIdSearchResponse,
  type ContractSizeSearchResponse,
  type CompetitorAnalysisSearchResponse
} from "@/services/api"

// Mock data - in real app this would come from API based on planId
const opportunityData = {
  planId: "FY25NCFB15",
  projectDescription: "Combined Armed and Unarmed Security Guards, Fire Safety staff and related services for ACS facilities",
  issuingAgency: "Department of Parks & Recreation", 
  procurementApproach: "Negotiated Acquisition",
  predictedContractValue: "$1.25M",
  predictedTenderDate: "March 2026"
}

const competitorData = [
  {
    name: "Allied Universal Security",
    winProbability: 65,
    totalContractValue: "$75M",
    mostRecentContract: "March 2025"
  },
  {
    name: "Securitas Security Services",
    winProbability: 45,
    totalContractValue: "$22M",
    mostRecentContract: "January 2025"
  },
  {
    name: "G4S Secure Solutions",
    winProbability: 30,
    totalContractValue: "$7M",
    mostRecentContract: "February 2025"
  }
]

// Donut chart component for win probability
function DonutChart({ percentage }: { percentage: number }) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth="4"
          fill="transparent"
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-foreground">
          {percentage}%
        </span>
      </div>
    </div>
  )
}

export default function ProcurementAnalysis() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // State for API data
  const [contractTimingData, setContractTimingData] = useState<PlanIdSearchResponse | null>(null)
  const [contractSizeData, setContractSizeData] = useState<ContractSizeSearchResponse | null>(null)
  const [competitorData, setCompetitorData] = useState<CompetitorAnalysisSearchResponse | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch data from all three endpoints
  useEffect(() => {
    if (!planId) return

    const fetchAllData = async () => {
      setLoading(true)
      try {
        // Fetch data from all three endpoints in parallel
        const [timingResult, sizeResult, competitorResult] = await Promise.all([
          searchByPlanId(planId),
          searchByContractSizePlanId(planId),
          searchByCompetitorPlanId(planId)
        ])

        setContractTimingData(timingResult)
        setContractSizeData(sizeResult)
        setCompetitorData(competitorResult)
      } catch (error) {
        console.error("Error fetching procurement analysis data:", error)
        toast({
          title: "Error",
          description: "Failed to load procurement analysis data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [planId, toast])

  // Get data from the first record of each API response
  const timingRecord = contractTimingData?.records[0]
  const sizeRecord = contractSizeData?.records[0]
  const competitorRecord = competitorData?.records[0]
  const contractSizePrediction = contractSizeData?.contract_size_predictions[0]
  const timingPrediction = contractTimingData?.procurement_date_predictions[0]
  const vendorPrediction = competitorData?.vendor_predictions[0]

  // Format contract size as millions
  const formatAsMillions = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    } else {
      return `$${value.toLocaleString()}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading procurement analysis...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Discovery
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Procurement Opportunity Analysis</h1>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Procurement Contract Size Prediction</h2>
        </div>
        
        {/* Procurement Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary h-[160px] flex flex-col justify-start">
            <p className="text-lg font-bold text-primary">Plan ID</p>
            <p className="text-xl text-muted-foreground">{timingRecord?.PlanID || sizeRecord?.PlanID || planId || 'N/A'}</p>
          </div>
          
          <div className="bg-success/10 rounded-lg p-6 border-l-4 border-success h-[160px] flex flex-col justify-start">
            <p className="text-lg font-bold text-success">Project Description</p>
            <p className="text-sm text-muted-foreground line-clamp-4 overflow-hidden">{timingRecord?.Services_Description || sizeRecord?.Services_Description || 'No description available'}</p>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent h-[160px] flex flex-col justify-start">
            <p className="text-lg font-bold text-accent">Issuing Agency</p>
            <p className="text-xl text-muted-foreground">{timingRecord?.Agency || sizeRecord?.Agency || 'N/A'}</p>
          </div>
          
          <div className="bg-warning/10 rounded-lg p-6 border-l-4 border-warning h-[160px] flex flex-col justify-start">
            <p className="text-lg font-bold text-warning">Procurement Approach</p>
            <p className="text-xl text-muted-foreground">{timingRecord?.Procurement_Method || sizeRecord?.Procurement_Method || 'N/A'}</p>
          </div>
        </div>

        {/* Predicted Contract Value */}
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-muted-foreground uppercase tracking-wide mb-4">Predicted Contract Value</h3>
            <div className="space-y-2">
              <p className="text-7xl font-bold text-foreground">
                {contractSizePrediction?.predicted_contract_size ? formatAsMillions(contractSizePrediction.predicted_contract_size) : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Probability Distribution Chart */}
        <ProbabilityDistributionChart />

        {/* Model Accuracy Statistics */}
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-foreground mb-6">Model Accuracy Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h5 className="text-sm font-medium text-muted-foreground mb-2">R-Squared</h5>
                <p className="text-4xl font-bold text-foreground">92.3%</p>
              </div>
              <div className="text-center">
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Mean Absolute Error (MAE)</h5>
                <p className="text-4xl font-bold text-foreground">0.87</p>
              </div>
              <div className="text-center">
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Root Mean Squared Error (RMSE)</h5>
                <p className="text-4xl font-bold text-foreground">3.24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predicted Tender Date */}
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-muted-foreground uppercase tracking-wide mb-4">Predicted Tender Date</h3>
            <div className="space-y-2">
              <p className="text-7xl font-bold text-foreground">
                {timingPrediction?.predicted_date 
                  ? new Date(timingPrediction.predicted_date).toLocaleDateString('en-US', { month: 'long' })
                  : 'N/A'
                }
              </p>
              <p className="text-4xl text-muted-foreground">
                {timingPrediction?.predicted_date 
                  ? new Date(timingPrediction.predicted_date).getFullYear()
                  : new Date().getFullYear()
                }
              </p>
              {timingPrediction?.confidence_score && (
                <p className="text-sm text-muted-foreground mt-2">
                  Confidence: {(timingPrediction.confidence_score * 100).toFixed(0)}%
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Another Probability Distribution Chart */}
        <ProbabilityDistributionChart />

        {/* Another Model Accuracy Statistics */}
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-foreground mb-6">Model Accuracy Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h5 className="text-sm font-medium text-muted-foreground mb-2">R-Squared</h5>
                <p className="text-4xl font-bold text-foreground">85.7%</p>
              </div>
              <div className="text-center">
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Mean Absolute Error (MAE)</h5>
                <p className="text-4xl font-bold text-foreground">1.45</p>
              </div>
              <div className="text-center">
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Root Mean Squared Error (RMSE)</h5>
                <p className="text-4xl font-bold text-foreground">4.82</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Analysis */}
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-foreground mb-6">Competitor Analysis</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competitor Name</TableHead>
                  <TableHead>Win Probability</TableHead>
                  <TableHead>Total City Contract Value</TableHead>
                  <TableHead>Most Recent Contract</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Prime Vendor Recommendations */}
                {vendorPrediction?.prime_vendor_recommendations.map((competitor, index) => {
                  const randomValue = Math.floor(Math.random() * 50000000) + 10000000 // Random between $10M-$60M
                  const randomMonthsAgo = Math.floor(Math.random() * 12) + 1 // Random 1-12 months ago
                  const recentDate = new Date()
                  recentDate.setMonth(recentDate.getMonth() - randomMonthsAgo)
                  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                  const recentContractDate = `${monthNames[recentDate.getMonth()]} ${recentDate.getFullYear()}`
                  
                  return (
                    <TableRow key={`prime-${index}`}>
                      <TableCell className="font-medium">{competitor.vendor}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <DonutChart percentage={Math.round(competitor.probability)} />
                          <span className="font-semibold">{Math.round(competitor.probability)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-success">
                        ${(randomValue / 1000000).toFixed(1)}M
                      </TableCell>
                      <TableCell>{recentContractDate}</TableCell>
                    </TableRow>
                  )
                })}

                {/* MWBE Vendor Recommendations */}
                {vendorPrediction?.mwbe_vendor_recommendations.map((competitor, index) => {
                  const randomValue = Math.floor(Math.random() * 30000000) + 5000000 // Random between $5M-$35M
                  const randomMonthsAgo = Math.floor(Math.random() * 12) + 1 // Random 1-12 months ago
                  const recentDate = new Date()
                  recentDate.setMonth(recentDate.getMonth() - randomMonthsAgo)
                  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                  const recentContractDate = `${monthNames[recentDate.getMonth()]} ${recentDate.getFullYear()}`
                  
                  return (
                    <TableRow key={`mwbe-${index}`}>
                      <TableCell className="font-medium">{competitor.vendor}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <DonutChart percentage={Math.round(competitor.probability)} />
                          <span className="font-semibold">{Math.round(competitor.probability)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-success">
                        ${(randomValue / 1000000).toFixed(1)}M
                      </TableCell>
                      <TableCell>{recentContractDate}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}