import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { searchByAgencyName, type AgencyAnalysisSearchResponse } from "@/services/api"

interface AgencyAnalysisProps {
  agencyName?: string;
}


// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return (amount / 1000000).toFixed(1)
}

// Helper function to format percentage
const formatPercentage = (percentage: number): string => {
  return percentage.toFixed(1)
}

export function AgencyAnalysis({ agencyName }: AgencyAnalysisProps) {
  const [data, setData] = useState<AgencyAnalysisSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agencyName) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await searchByAgencyName(agencyName);
        setData(response);
      } catch (err) {
        console.error('Failed to fetch agency analysis data:', err);
        setError('Failed to fetch agency analysis data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agencyName]);

  // Show placeholder when no agencyName is provided
  if (!agencyName) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <span className="text-2xl">🏛️</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Agency Analysis</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Enter a Plan ID in the Contract Timing tab to view detailed agency budget analysis and spending breakdown.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Loading Agency Analysis...</h3>
            <p className="text-sm text-muted-foreground">Fetching data for Agency: {agencyName}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Error Loading Agency Analysis</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show data when available
  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Agency Budget Spend Down Analysis</h1>
        <h2 className="text-2xl font-semibold text-foreground">{data.agency} Agency</h2>
      </div>

      {/* Agency Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Agency Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold text-foreground">${formatCurrency(data.total_budget)}M</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Contracts</p>
              <p className="text-2xl font-bold text-foreground">{data.total_count}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg Contract Size</p>
              <p className="text-2xl font-bold text-foreground">${formatCurrency(data.avg_contract_size)}M</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
              <p className="text-2xl font-bold text-foreground">{(data.avg_confidence * 100).toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agency Budget Overview */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-foreground">Agency Budget Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.categories.map((category, index) => {
            const isProjectMatch = category.category_name === "Park Operations & Maintenance"
            return (
              <Card key={index} className="gradient-card shadow-card hover:shadow-hover transition-smooth relative overflow-hidden">
                {isProjectMatch && (
                  <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                )}
                <CardContent className="p-6 space-y-4 relative">
                  {isProjectMatch && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-md font-medium">
                      Project Category Match
                    </div>
                  )}
                  <h4 className="font-semibold text-foreground text-lg">{category.category_name}</h4>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">${formatCurrency(category.total_budget)}</span>
                      <span className="text-sm text-muted-foreground">Million</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-primary">{formatPercentage(category.budget_percentage)}%</span>
                      <span className="text-sm text-muted-foreground">of total budget</span>
                    </div>
                  </div>
                  
                  {/* Subcategories */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Includes:</p>
                    <div className="text-xs text-muted-foreground">
                      {category.subcategories.map((subcategory, subIndex) => (
                        <span key={subIndex}>
                          {subcategory.subcategory_name}
                          {subIndex < category.subcategories.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Budget Spending Breakdown */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-foreground">Budget Spending Breakdown</h3>
        
        <Card className="shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Budget Category</TableHead>
                <TableHead className="font-semibold">Budget Total</TableHead>
                <TableHead className="font-semibold">Contract Count</TableHead>
                <TableHead className="font-semibold">Budget Percentage</TableHead>
                <TableHead className="font-semibold">Avg Contract Size</TableHead>
                <TableHead className="font-semibold">Avg Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.categories.map((category, index) => {
                const isProjectMatch = category.category_name === "Park Operations & Maintenance"
                return (
                  <TableRow key={index} className={isProjectMatch ? "bg-primary/5 relative" : ""}>
                    <TableCell className="font-medium relative">
                      <div>{category.category_name}</div>
                    </TableCell>
                    <TableCell>${formatCurrency(category.total_budget)}M</TableCell>
                    <TableCell>{category.total_count}</TableCell>
                    <TableCell>{formatPercentage(category.budget_percentage)}%</TableCell>
                    <TableCell>${formatCurrency(category.total_budget / category.total_count)}M</TableCell>
                    <TableCell className="font-semibold text-primary relative">
                      <div className="flex items-center justify-between">
                        <span>{((category.subcategories.reduce((sum, sub) => sum + sub.avg_confidence, 0) / category.subcategories.length) * 100).toFixed(1)}%</span>
                        {isProjectMatch && (
                          <div className="bg-primary text-primary-foreground px-1.5 py-0.5 text-[10px] rounded-sm font-medium ml-2">
                            Project Category Match
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
        
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Summary: {data.summary.total_categories} categories, {data.summary.total_subcategories} subcategories. 
            Largest category: {data.summary.largest_category} (${formatCurrency(data.summary.largest_category_budget)}M, {formatPercentage(data.summary.largest_category_percentage)}%)
          </p>
        </div>
      </div>
    </div>
  )
}