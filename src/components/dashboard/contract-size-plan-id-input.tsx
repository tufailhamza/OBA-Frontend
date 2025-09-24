import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { searchByContractSizePlanId } from "@/services/api"
import { toast } from "@/hooks/use-toast"

interface ContractSizePlanIdInputProps {
  onPlanIdSubmit: (planId: string) => void;
}

export function ContractSizePlanIdInput({ onPlanIdSubmit }: ContractSizePlanIdInputProps) {
  const [planId, setPlanId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planId.trim()) return

    console.log("ContractSizePlanIdInput: Submitting planId:", planId)
    setIsLoading(true)
    
    try {
      // Call the API to validate the plan ID
      const result = await searchByContractSizePlanId(planId.trim())
      console.log("ContractSizePlanIdInput: API result:", result)
      
      if (result.found) {
        onPlanIdSubmit(planId.trim())
        toast({
          title: "Plan ID Found",
          description: `Found ${result.total_records} records for ${planId}`,
        })
      } else {
        toast({
          title: "Plan ID Not Found",
          description: `No records found for ${planId}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("ContractSizePlanIdInput: Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to search for Plan ID",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testApiCall = async () => {
    console.log("ContractSizePlanIdInput: Testing API call directly...")
    try {
      const result = await searchByContractSizePlanId("FY25RNDCLA1")
      console.log("ContractSizePlanIdInput: Direct API test result:", result)
      toast({
        title: "API Test Success",
        description: "Direct API call successful!",
      })
    } catch (error) {
      console.error("ContractSizePlanIdInput: Direct API test error:", error)
      toast({
        title: "API Test Failed",
        description: error instanceof Error ? error.message : "API test failed",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Contract Size Analysis</CardTitle>
        <p className="text-muted-foreground">
          Enter a Plan ID to analyze contract size predictions and historical data.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Plan ID (e.g., FY25RNDCLA1)"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !planId.trim()}>
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
          
          {/* Debug section */}
          <div className="mt-4 p-3 bg-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Debug Tools:</p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={testApiCall}
              className="text-xs"
            >
              Test API Call
            </Button>
            <div className="text-xs text-muted-foreground mt-2">
              Debug: planId = {planId || 'empty'}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
