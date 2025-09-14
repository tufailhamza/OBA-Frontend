import { Card, CardContent } from "@/components/ui/card"

export function ProcurementInfoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary h-[160px] flex flex-col justify-start">
        <p className="text-lg font-bold text-primary">Plan ID</p>
        <p className="text-xl text-muted-foreground">FY25NCFB15</p>
      </div>
      
      <div className="bg-success/10 rounded-lg p-6 border-l-4 border-success h-[160px] flex flex-col justify-start">
        <p className="text-lg font-bold text-success">Project Description</p>
        <p className="text-xl text-muted-foreground">Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum</p>
      </div>
      
      <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent h-[160px] flex flex-col justify-start">
        <p className="text-lg font-bold text-accent">Issuing Agency</p>
        <p className="text-xl text-muted-foreground">Department of Parks & Recreation</p>
      </div>
      
      <div className="bg-warning/10 rounded-lg p-6 border-l-4 border-warning h-[160px] flex flex-col justify-start">
        <p className="text-lg font-bold text-warning">Procurement Approach</p>
        <p className="text-xl text-muted-foreground">Negotiated Acquisition</p>
      </div>
    </div>
  )
}

export function PredictedTenderDate() {
  return (
    <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
      <CardContent className="p-8 text-center">
        <h3 className="text-lg font-medium text-muted-foreground uppercase tracking-wide mb-4">Predicted Tender Date</h3>
        <div className="space-y-2">
          <p className="text-7xl font-bold text-foreground">March</p>
          <p className="text-4xl text-muted-foreground">2026</p>
        </div>
      </CardContent>
    </Card>
  )
}