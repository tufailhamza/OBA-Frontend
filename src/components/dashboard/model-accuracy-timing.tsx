import { Card, CardContent } from "@/components/ui/card"

export function ModelAccuracyStatsTiming() {
  return (
    <div className="mb-6">



      {/* Performance Metrics */}
      <h4 className="text-lg font-medium text-foreground mb-3">Performance Metrics</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
          <CardContent className="p-6 text-center">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">R-Squared</h4>
            <p className="text-5xl font-bold text-foreground">97.63%</p>
          </CardContent>
        </Card>
        
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
          <CardContent className="p-6 text-center">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Mean Absolute Error<br />(MAE)</h4>
            <p className="text-5xl font-bold text-foreground">0.30</p>
            <p className="text-sm text-muted-foreground mt-1">days</p>
          </CardContent>
        </Card>
        
        <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
          <CardContent className="p-6 text-center">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Prediction Std Dev</h4>
            <p className="text-5xl font-bold text-foreground">1.89</p>
            <p className="text-sm text-muted-foreground mt-1">days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
