import { Card, CardContent } from "@/components/ui/card"
import { ProcurementInfoCards } from "@/components/dashboard/procurement-cards"
import { ProbabilityDistributionChart } from "@/components/dashboard/prediction-chart"
import { ModelAccuracyStats } from "@/components/dashboard/model-accuracy"

export function PredictedContractValue() {
  return (
    <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
      <CardContent className="p-8 text-center">
        <h3 className="text-lg font-medium text-muted-foreground uppercase tracking-wide mb-4">Predicted Contract Value</h3>
        <div className="space-y-2">
          <p className="text-7xl font-bold text-foreground">$1.25M</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ContractSize() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Procurement Contract Size Prediction</h1>
      </div>
      
      {/* Procurement Info Cards */}
      <ProcurementInfoCards />
      
      {/* Predicted Contract Value */}
      <PredictedContractValue />
      
      {/* Probability Distribution Chart */}
      <ProbabilityDistributionChart />
      
      {/* Model Accuracy Statistics */}
      <ModelAccuracyStats />
    </div>
  )
}