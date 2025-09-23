import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { searchByPlanId } from "@/services/api"

interface PlanIdInputProps {
  onPlanIdSubmit: (planId: string) => void
  loading?: boolean
}

export function PlanIdInput({ onPlanIdSubmit, loading = false }: PlanIdInputProps) {
  const [planId, setPlanId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (planId.trim()) {
      console.log("PlanIdInput: Submitting planId:", planId.trim())
      onPlanIdSubmit(planId.trim())
    }
  }


  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Contract Timing Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planId">Plan ID</Label>
            <div className="flex gap-2">
              <Input
                id="planId"
                type="text"
                placeholder="Enter Plan ID (e.g., FY25RNDCLA1)"
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !planId.trim()}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Loading..." : "Analyze"}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter a Plan ID to view contract timing predictions and procurement details.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
