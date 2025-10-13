import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { searchByContractSizePlanId, type ContractSizeSearchResponse } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface PredictedContractSizeProps {
  planId?: string;
}

export function PredictedContractSize({ planId }: PredictedContractSizeProps) {
  const [data, setData] = useState<ContractSizeSearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  console.log("PredictedContractSize rendered with planId:", planId)

  useEffect(() => {
    if (!planId) return

    const fetchPrediction = async () => {
      setLoading(true)
      setError(null)
      console.log("PredictedContractSize: Fetching data for planId:", planId)
      try {
        const result = await searchByContractSizePlanId(planId)
        console.log("PredictedContractSize: API result:", result)
        setData(result)
      } catch (err) {
        console.error("PredictedContractSize: API error:", err)
        setError('Contract Size API is currently unavailable. Please check backend status.')
        toast({
          title: "Contract Size API Unavailable",
          description: "The contract size prediction service is currently down. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPrediction()
  }, [planId, toast])

  if (!planId) {
    return (
      <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium text-muted-foreground uppercase tracking-wide mb-4">Predicted Contract Size</h3>
          <div className="space-y-2">
            <p className="text-2xl text-muted-foreground">Enter a Plan ID to get predictions</p>
            <p className="text-sm text-muted-foreground">Use the search box above to analyze contract size</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading prediction...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data?.found || !data.contract_size_predictions || data.contract_size_predictions.length === 0) {
    return (
      <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium text-muted-foreground uppercase tracking-wide mb-4">Predicted Contract Size</h3>
          <div className="space-y-2">
            <p className="text-2xl text-muted-foreground">No prediction available</p>
            <p className="text-sm text-muted-foreground">Unable to load contract size prediction</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const prediction = data.contract_size_predictions[0]

  return (
    <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth mb-6">
      <CardContent className="p-8 text-center">
        <h3 className="text-lg font-medium text-muted-foreground uppercase tracking-wide mb-4">Predicted Contract Size</h3>
        <div className="space-y-2">
          <p className="text-7xl font-bold text-foreground">
            {prediction?.predicted_contract_size ? `$${prediction.predicted_contract_size}M` : 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
