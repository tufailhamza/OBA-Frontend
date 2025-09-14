import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import { ProbabilityDistributionChart } from "@/components/dashboard/prediction-chart"

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
            <p className="text-xl text-muted-foreground">{opportunityData.planId}</p>
          </div>
          
          <div className="bg-success/10 rounded-lg p-6 border-l-4 border-success h-[160px] flex flex-col justify-start">
            <p className="text-lg font-bold text-success">Project Description</p>
            <p className="text-sm text-muted-foreground">{opportunityData.projectDescription}</p>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent h-[160px] flex flex-col justify-start">
            <p className="text-lg font-bold text-accent">Issuing Agency</p>
            <p className="text-xl text-muted-foreground">{opportunityData.issuingAgency}</p>
          </div>
          
          <div className="bg-warning/10 rounded-lg p-6 border-l-4 border-warning h-[160px] flex flex-col justify-start">
            <p className="text-lg font-bold text-warning">Procurement Approach</p>
            <p className="text-xl text-muted-foreground">{opportunityData.procurementApproach}</p>
          </div>
        </div>

        {/* Predicted Contract Value */}
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-muted-foreground uppercase tracking-wide mb-4">Predicted Contract Value</h3>
            <div className="space-y-2">
              <p className="text-7xl font-bold text-foreground">{opportunityData.predictedContractValue}</p>
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
                <p className="text-4xl font-bold text-foreground">88.94%</p>
              </div>
              <div className="text-center">
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Mean Absolute Error (MAE)</h5>
                <p className="text-4xl font-bold text-foreground">1.22</p>
              </div>
              <div className="text-center">
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Root Mean Squared Error (RMSE)</h5>
                <p className="text-4xl font-bold text-foreground">5.17</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predicted Tender Date */}
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-muted-foreground uppercase tracking-wide mb-4">Predicted Tender Date</h3>
            <div className="space-y-2">
              <p className="text-7xl font-bold text-foreground">March</p>
              <p className="text-4xl text-muted-foreground">2026</p>
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
                <p className="text-4xl font-bold text-foreground">88.94%</p>
              </div>
              <div className="text-center">
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Mean Absolute Error (MAE)</h5>
                <p className="text-4xl font-bold text-foreground">1.22</p>
              </div>
              <div className="text-center">
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Root Mean Squared Error (RMSE)</h5>
                <p className="text-4xl font-bold text-foreground">5.17</p>
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
                {competitorData.map((competitor, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{competitor.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <DonutChart percentage={competitor.winProbability} />
                        <span className="font-semibold">{competitor.winProbability}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-success">{competitor.totalContractValue}</TableCell>
                    <TableCell>{competitor.mostRecentContract}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}