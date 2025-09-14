import { Header } from "../components/dashboard/headers"
import { Filters } from "@/components/dashboard/filters"
import { Discovery } from "@/components/dashboard/discovery"
import { ProcurementInfoCards, PredictedTenderDate } from "@/components/dashboard/procurement-cards"
import { ProbabilityDistributionChart } from "@/components/dashboard/prediction-chart"
import { ModelAccuracyStats } from "@/components/dashboard/model-accuracy"
import { AgencyAnalysis } from "@/components/dashboard/agency-analysis"
import { CompetitorAnalysis } from "@/components/dashboard/competitor-analysis"
import { ContractSize } from "@/components/dashboard/contract-size"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Search Filters Sidebar */}
      <div className="w-[365px] p-6 border-r border-border">
        <Filters />
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
              <Discovery />
            </TabsContent>
            
            <TabsContent value="contract-timing" className="space-y-6 mt-6">
              <div className="space-y-6">
                {/* Page Title */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-foreground">Procurement Tendering Prediction</h1>
                </div>
                
                {/* Procurement Info Cards */}
                <ProcurementInfoCards />
                
                {/* Predicted Tender Date */}
                <PredictedTenderDate />
                
                {/* Probability Distribution Chart */}
                <ProbabilityDistributionChart />
                
                {/* Model Accuracy Statistics */}
                <ModelAccuracyStats />
              </div>
            </TabsContent>
            
            <TabsContent value="agency-analysis" className="space-y-6 mt-6">
              <AgencyAnalysis />
            </TabsContent>
            
            <TabsContent value="contract-size" className="space-y-6 mt-6">
              <ContractSize />
            </TabsContent>
            
            <TabsContent value="competitor-analysis" className="space-y-6 mt-6">
              <CompetitorAnalysis />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
