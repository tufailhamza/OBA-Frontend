import { useState } from "react"
import { Header } from "../components/dashboard/headers"
import { Filters } from "@/components/dashboard/filters"
import { Discovery } from "@/components/dashboard/discovery"
import { ProcurementInfoCards, PredictedTenderDate } from "@/components/dashboard/procurement-cards"
import { ProbabilityDistributionChartTiming } from "@/components/dashboard/prediction-chart-timing"
import { ProbabilityDistributionChartSize } from "@/components/dashboard/prediction-chart-size"
import { ModelAccuracyStatsTiming } from "@/components/dashboard/model-accuracy-timing"
import { ModelAccuracyStatsSize } from "@/components/dashboard/model-accuracy-size"
import { AgencyAnalysis } from "@/components/dashboard/agency-analysis"
import { CompetitorAnalysis } from "@/components/dashboard/competitor-analysis"
import { ContractSize } from "@/components/dashboard/contract-size"
import { PlanIdInput } from "@/components/dashboard/plan-id-input"
import { ContractSizeProcurementCards } from "@/components/dashboard/contract-size-procurement-cards"
import { PredictedContractSize } from "@/components/dashboard/predicted-contract-size"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type ProcurementSearchFilters, searchByPlanId } from "@/services/api"

const Index = () => {
  const [searchFilters, setSearchFilters] = useState<ProcurementSearchFilters | undefined>(undefined)
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(undefined)
  const [selectedAgencyName, setSelectedAgencyName] = useState<string | undefined>(undefined)

  const handleSearch = (filters: ProcurementSearchFilters) => {
    setSearchFilters(filters)
  }

  const handlePlanIdSubmit = async (planId: string) => {
    console.log("Index: Received planId:", planId)
    setSelectedPlanId(planId)
    console.log("Index: Setting selectedPlanId to:", planId)
    
    // Fetch the agency name from the Contract Timing API response
    try {
      const response = await searchByPlanId(planId)
      if (response.records && response.records.length > 0) {
        const agencyName = response.records[0].Agency
        setSelectedAgencyName(agencyName)
        console.log("Index: Setting selectedAgencyName to:", agencyName)
      }
    } catch (error) {
      console.error("Failed to fetch agency name:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Search Filters Sidebar */}
      <div className="w-[365px] p-6 border-r border-border">
        <Filters onSearch={handleSearch} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Navigation Tabs */}
          <Tabs defaultValue="discovery" className="w-full">
            <TabsList className="grid w-full grid-cols-5 max-w-5xl">
              <TabsTrigger value="discovery">Discovery</TabsTrigger>
              <TabsTrigger value="contract-timing">Contract Timing</TabsTrigger>
              <TabsTrigger value="contract-size">Contract Size</TabsTrigger>
              <TabsTrigger value="agency-analysis">Agency Analysis</TabsTrigger>
              <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="discovery" className="space-y-6 mt-6">
              <Discovery searchFilters={searchFilters} />
            </TabsContent>
            
            <TabsContent value="contract-timing" className="space-y-6 mt-6">
              <PlanIdInput onPlanIdSubmit={handlePlanIdSubmit} />
              <ProcurementInfoCards planId={selectedPlanId} />
              <PredictedTenderDate planId={selectedPlanId} />
              <ProbabilityDistributionChartTiming planId={selectedPlanId} />
              <ModelAccuracyStatsTiming />
             
            </TabsContent>
            
            <TabsContent value="agency-analysis" className="space-y-6 mt-6">
              <AgencyAnalysis agencyName={selectedAgencyName} />
            </TabsContent>
            
            <TabsContent value="contract-size" className="space-y-6 mt-6">
              <ContractSizeProcurementCards planId={selectedPlanId} />
              <PredictedContractSize planId={selectedPlanId} />
              <ProbabilityDistributionChartSize planId={selectedPlanId} />
              <ModelAccuracyStatsSize />
           
            </TabsContent>
            
            <TabsContent value="competitor-analysis" className="space-y-6 mt-6">
              <CompetitorAnalysis planId={selectedPlanId} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
