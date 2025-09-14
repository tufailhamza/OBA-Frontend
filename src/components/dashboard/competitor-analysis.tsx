import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export function CompetitorAnalysis() {
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
            <p className="text-sm text-muted-foreground">Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum</p>
          </div>

          {/* Issuing Agency */}
          <div className="bg-success/10 rounded-lg p-6 border-l-4 border-success min-h-[120px] flex flex-col justify-center">
            <p className="text-lg font-bold text-success">Issuing Agency</p>
            <p className="text-sm text-muted-foreground">Department of Parks & Recreation</p>
          </div>

          {/* Procurement Approach */}
          <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent min-h-[120px] flex flex-col justify-center">
            <p className="text-lg font-bold text-accent">Procurement Approach</p>
            <p className="text-sm text-muted-foreground">Negotiated Acquisition</p>
          </div>

          {/* Predicted Contract Value */}
          <div className="bg-warning/10 rounded-lg p-6 border-l-4 border-warning min-h-[120px] flex flex-col justify-center">
            <p className="text-lg font-bold text-warning">Predicted Contract Value</p>
            <p className="text-sm text-muted-foreground">$1.25M</p>
          </div>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-foreground">Competitor Analysis</h3>
        
        <Card className="shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Competitor Name</TableHead>
                <TableHead className="font-semibold text-center">Win Probability</TableHead>
                <TableHead className="font-semibold text-center">Total City Contracts Value</TableHead>
                <TableHead className="font-semibold text-center">Most Recent Contract Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitorData.map((competitor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{competitor.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <DonutChart percentage={competitor.winProbabilityValue} />
                      <span className="text-2xl font-bold text-foreground">{competitor.winProbability}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-2xl font-bold text-foreground">{competitor.totalContractsValue}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-lg font-semibold text-foreground">
                        {competitor.recentContractDate}
                      </div>
                      <div className="text-sm font-light text-green-600">
                        {competitor.monthsAgo}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}