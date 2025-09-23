import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { searchByContractSizePlanId, type ContractSizeSearchResponse } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ContractSizeProcurementCardsProps {
  planId?: string
}

export function ContractSizeProcurementCards({ planId }: ContractSizeProcurementCardsProps) {
  const [data, setData] = useState<ContractSizeSearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  console.log("ContractSizeProcurementCards rendered with planId:", planId)

  useEffect(() => {
    if (!planId) return

    const fetchData = async () => {
      setLoading(true)
      console.log("Fetching contract size data for planId:", planId)
      try {
        const result = await searchByContractSizePlanId(planId)
        console.log("Contract size API result:", result)
        setData(result)
      } catch (err) {
        console.error("Contract size API error:", err)
        toast({
          title: "Error",
          description: "Failed to fetch procurement data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [planId, toast])

  const record = data?.records[0]

  if (!planId) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25 mb-6">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">Enter a Plan ID to view procurement details</p>
          <p className="text-sm text-muted-foreground">Use the search box above to get started</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25 mb-6">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading procurement data...</span>
        </div>
      </div>
    )
  }

  if (!data?.found || !record) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25 mb-6">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">No procurement data found</p>
          <p className="text-sm text-muted-foreground">No records found for Plan ID: {planId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary h-[160px] flex flex-col justify-start">
        <p className="text-lg font-bold text-primary">Plan ID</p>
        <p className="text-xl text-muted-foreground">{loading ? 'Loading...' : (record?.PlanID || 'N/A')}</p>
      </div>
      
      <div className="bg-success/10 rounded-lg p-6 border-l-4 border-success h-[160px] flex flex-col justify-start">
        <p className="text-lg font-bold text-success">Project Description</p>
        <p className="text-xl text-muted-foreground line-clamp-4 overflow-hidden">{loading ? 'Loading...' : (record?.Services_Description || 'No description available')}</p>
      </div>
      
      <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent h-[160px] flex flex-col justify-start">
        <p className="text-lg font-bold text-accent">Issuing Agency</p>
        <p className="text-xl text-muted-foreground">{loading ? 'Loading...' : (record?.Agency || 'N/A')}</p>
      </div>
      
      <div className="bg-warning/10 rounded-lg p-6 border-l-4 border-warning h-[160px] flex flex-col justify-start">
        <p className="text-lg font-bold text-warning">Procurement Method</p>
        <p className="text-xl text-muted-foreground">{loading ? 'Loading...' : (record?.Procurement_Method || 'N/A')}</p>
      </div>
    </div>
  )
}
