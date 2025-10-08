import { Card, CardContent } from "@/components/ui/card"

export function ModelAccuracyStatsSize() {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">Model Accuracy Statistics - Contract Size</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
          <CardContent className="p-6 text-center">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">R-Squared</h4>
            <p className="text-5xl font-bold text-foreground">91.19%</p>
          </CardContent>
        </Card>
        
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
          <CardContent className="p-6 text-center">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Mean Absolute Error<br />(MAE)</h4>
            <p className="text-5xl font-bold text-foreground">$16.3K</p>
          </CardContent>
        </Card>
        
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
          <CardContent className="p-6 text-center">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Root Mean Squared Error<br />(RMSE)</h4>
            <p className="text-5xl font-bold text-foreground">$20.6K</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
