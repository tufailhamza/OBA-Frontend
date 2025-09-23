import { useState } from "react"
import { Header } from "../components/dashboard/headers"
import { Filters } from "@/components/dashboard/filters"
import { Discovery } from "@/components/dashboard/discovery"
import { ProcurementInfoCards, PredictedTenderDate } from "@/components/dashboard/procurement-cards"
import { ProbabilityDistributionChart } from "@/components/dashboard/prediction-chart"
import { ModelAccuracyStats } from "@/components/dashboard/model-accuracy"
import { AgencyAnalysis } from "@/components/dashboard/agency-analysis"
import { CompetitorAnalysis } from "@/components/dashboard/competitor-analysis"
import { ContractSize } from "@/components/dashboard/contract-size"
import { PlanIdInput } from "@/components/dashboard/plan-id-input"
import { ContractSizeProcurementCards } from "@/components/dashboard/contract-size-procurement-cards"
import { PredictedContractSize } from "@/components/dashboard/predicted-contract-size"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type ProcurementSearchFilters } from "@/services/api"

const Index = () => {
  const [searchFilters, setSearchFilters] = useState<ProcurementSearchFilters | undefined>(undefined)
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(undefined)

  const handleSearch = (filters: ProcurementSearchFilters) => {
    setSearchFilters(filters)
  }

  const handlePlanIdSubmit = (planId: string) => {
    console.log("Index: Received planId:", planId)
    setSelectedPlanId(planId)
    console.log("Index: Setting selectedPlanId to:", planId)
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
              <ProbabilityDistributionChart />
              <ModelAccuracyStats />
              {/* Debug info */}
              <div className="text-xs text-muted-foreground">
                Debug: selectedPlanId = {selectedPlanId || 'undefined'}
              </div>
            </TabsContent>
            
            <TabsContent value="agency-analysis" className="space-y-6 mt-6">
              <AgencyAnalysis />
            </TabsContent>
            
            <TabsContent value="contract-size" className="space-y-6 mt-6">
              <ContractSizeProcurementCards planId={selectedPlanId} />
              <PredictedContractSize planId={selectedPlanId} />
              <ProbabilityDistributionChart />
              <ModelAccuracyStats />
              {/* Debug info */}
              <div className="text-xs text-muted-foreground">
                Debug: selectedPlanId = {selectedPlanId || 'undefined'}
              </div>
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
