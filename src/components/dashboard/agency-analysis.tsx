import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { KpiCard } from "@/components/ui/kpi-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell } from "recharts"
import { useState, useEffect } from "react"
import { getContractBudgetBreakdown, searchByContractSizePlanId, type ContractBudgetBreakdownResponse, type ContractSizeSearchResponse } from "@/services/api"
import { Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

const budgetData = [
]


const AGENCIES = [
  "Administration for Children's Services",
  "Board of Elections",
  "City University of New York",
  "Department of Citywide Administrative Services",
  "Department of Correction",
  "Department of Cultural Affairs",
  "Department of Design and Construction",
  "Department of Education",
  "Department of Environmental Protection",
  "Department of Finance",
  "Department of Health and Mental Hygiene",
  "Department of Homeless Services",
  "Housing Preservation and Development",
  "Department of Information Technology and Telecommunications",
  "Department of Investigation",
  "Department of Parks and Recreation",
  "Department of Probation",

  "Department of Sanitation",
  "Department of Small Business Services",
  "Department of Transportation",
  "Department of Veterans' Services",
  "Fire Department of New York",
  "Law Department",

  "NYC Taxi and Limousine Commission",

]

// Mapping from full agency names to API codes
const AGENCY_CODE_MAP: Record<string, string> = {
  "Administration for Children's Services": "ACS",
  "Board of Elections": "BOC",
  "City University of New York": "CUNY",
  "Civilian Complaint Review Board": "CCRB",
  "Commission on Human Rights": "CCHR",
  "Department for the Aging": "DFTA",
  "Department of Buildings": "DOB",
  "Department of City Planning": "DCP",
  "Department of Citywide Administrative Services": "DCAS",
  "Department of Consumer and Worker Protection": "DCWP",
  "Department of Correction": "DOC",
  "Department of Cultural Affairs": "DCLA",
  "Department of Design and Construction": "DDC",
  "Department of Education": "DOE",
  "Department of Environmental Protection": "DEP",
  "Department of Finance": "DOF",
 
  "Department of Health and Mental Hygiene": "DOHMH",
  "Department of Homeless Services": "DHS",
  "Housing Preservation and Development": "HPD",
  "Department of Information Technology and Telecommunications": "OTI",
  "Department of Investigation": "DOI",
  "Department of Parks and Recreation": "DPR",
  "Department of Probation": "DOP",
  "Department of Sanitation": "DSNY",
  "Department of Small Business Services": "SBS",
  "Department of Transportation": "DOT",
  "Department of Veterans' Services": "DVS",
  "Fire Department of New York": "FDNY",
  "Law Department": "LAW",
 
  "NYC Taxi and Limousine Commission": "TLC",
  "Office of Administrative Trials and Hearings": "OATH"
}

// Hardcoded FY26 Agency Budget values
const FY26_AGENCY_BUDGET: Record<string, number> = {
  "Administration for Children's Services": 2826000000,
  "Board of Elections": 146736000.0,
  "City University of New York": 1283000000.0,
  "Civilian Complaint Review Board": 27877000.0,
  "Commission on Human Rights": 14962000,
  "Department for the Aging": 426174000,
  "Department of Buildings": 220378000,
  "Department of City Planning": 4673800,
  "Department of Citywide Administrative Services": 1933000000.0,
  "Department of Consumer and Worker Protection": 75112000.0,
  "Department of Correction": 1213318000.0,
  "Department of Cultural Affairs": 164373000,
  "Department of Design and Construction": 159394000.0,
  "Department of Education": 33498697000,
  "Department of Environmental Protection": 1640602000.0,
  "Department of Finance": 358489000,
  "Department of Health and Mental Hygiene": 713685000.0,
  "Department of Homeless Services": 3578000000.0,
  "Housing Preservation and Development": 1689200000,
  "Department of Information Technology and Telecommunications": 743197000.0,
  "Department of Investigation": 54957000.0,
  "Department of Parks and Recreation": 640412000,
  "Department of Probation": 114552000.0,
  "Department of Sanitation": 1932058000.0,
  "Department of Small Business Services": 182126000.0,
  "Department of Transportation": 1465610000.0,
  "Department of Veterans' Services": 5873000.0,
  "Fire Department of New York": 2640700000,
  "Law Department": 25898400,
  "New York Public Library": 480334000.0,
  "NYC Taxi and Limousine Commission": 58035000
}

// Hardcoded FY26 Contracts Budget values from contract.csv
const FY26_CONTRACTS_BUDGET: Record<string, number> = {
  "Administration for Children's Services": 1689895000.0,
  "Board of Elections": 20263000.0,
  "City University of New York": 26046000.0,
  "Civilian Complaint Review Board": 261891000.0,
  "Commission on Human Rights": 386886000.0,
  "Department for the Aging": 291738000.0,
  "Department of Buildings": 28021000.0,
  "Department of City Planning": 3924000.0,
  "Department of Citywide Administrative Services": 740410000.0,
  "Department of Consumer & Worker Protection": 26871000.0,
  "Department of Correction": 63086000.0,
  "Department of Cultural Affairs": 29856052000.0,
  "Department of Design and Construction": 31550000.0,
  "Department of Education": 10841321000,
  "Department of Environmental Protection": 287465000.0,
  "Department of Finance": 80173000.0,
  "Department of Health and Mental Hygiene": 503390800.0,
  "Department of Homeless Services": 3074766000.0,
  "Department Of Investigation": 5460273000.0,
  "Department of Parks and Recreation": 68781000.0,
  "Department of Probation": 21192000.0,
  "Department of Sanitation": 535411000.0,
  "Department of Transportation": 417139000.0,
  "Department of Veterans' Services": 710000.0,
  "Housing Preservation and Development": 26871000.0,
  "Department of Social Services": 922806000.0,
  "Law Department": 32320000.0,
  "New York Public Library": 26871000.0,
  "Office of Administrative Trials and Hearings": 7715000.0,
  "Department of Small Business Services": 136092000.0,
  "NYC Taxi and Limousine Commission": 4449000.0
}

const MiniDonutChart = ({ spent, total }: { spent: string; total: string }) => {
  const spentNum = parseFloat(spent.replace(/[$,]/g, ''))
  const totalNum = parseFloat(total.replace(/[$,]/g, ''))
  
  if (totalNum === 0) {
    return <div className="text-xs text-muted-foreground">N/A</div>
  }
  
  const percentage = Math.round((spentNum / totalNum) * 100)
  const remaining = 100 - percentage
  
  const data = [
    { name: 'Spent', value: percentage },
    { name: 'Remaining', value: remaining }
  ]
  
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="p-2">
        <PieChart width={50} height={50}>
          <Pie
            data={data}
            cx={25}
            cy={25}
            innerRadius={14}
            outerRadius={20}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill="hsl(var(--primary))" />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </div>
      <span className="text-sm font-medium">{percentage}%</span>
    </div>
  )
}

interface AgencyAnalysisProps {
  agencyName?: string;
  planId?: string;
  selectedAgency?: string;
  onAgencyChange?: (agency: string) => void;
}

export function AgencyAnalysis({ agencyName, planId, selectedAgency = "", onAgencyChange }: AgencyAnalysisProps) {
  const [budgetBreakdown, setBudgetBreakdown] = useState<ContractBudgetBreakdownResponse | null>(null)
  const [contractSizeData, setContractSizeData] = useState<ContractSizeSearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleAgencyChange = (agency: string) => {
    if (onAgencyChange) {
      onAgencyChange(agency)
    }
  }

  // Fetch budget breakdown when agency is selected from dropdown
  useEffect(() => {
    // Clear budget breakdown immediately when agency changes
    setBudgetBreakdown(null)
    setSortColumn(null)
    setSortDirection('asc')
    
    if (!selectedAgency) {
      return
    }

    const fetchBudgetBreakdown = async () => {
      setLoading(true)
      setError(null)
      try {
        // Convert full agency name to code for API call
        const agencyCode = AGENCY_CODE_MAP[selectedAgency] || selectedAgency
        const data = await getContractBudgetBreakdown(agencyCode)
        console.log("Budget breakdown data received:", data)
        console.log("Top capital contracts:", data.top_capital_contracts)
        setBudgetBreakdown(data)
      } catch (err) {
        console.error("Error fetching contract budget breakdown:", err)
        setError(err instanceof Error ? err.message : "Failed to load budget breakdown")
      } finally {
        setLoading(false)
      }
    }

    fetchBudgetBreakdown()
  }, [selectedAgency])

  // Fetch contract size data to get project description (only if planId is provided and user wants it)
  // Removed automatic fetching - now only fetches if planId is explicitly provided
  // This can be triggered manually if needed

  // Format number with comma separators (full dollar amounts)
  const formatToThousands = (value: number): string => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  // Format number with comma separators (for contract counts)
  const formatNumber = (value: number): string => {
    return value.toLocaleString('en-US')
  }

  // Format currency amounts (for large contract amounts)
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`
    } else {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column and default to ascending
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Sort records based on current sort settings
  const getSortedRecords = () => {
    if (!budgetBreakdown?.records || !sortColumn) {
      return budgetBreakdown?.records || []
    }

    const sorted = [...budgetBreakdown.records].sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      switch (sortColumn) {
        case 'category':
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        case 'fy26_preliminary':
          aValue = a.fy26_preliminary
          bValue = b.fy26_preliminary
          break
        case 'number_of_contracts':
          aValue = a.number_of_contracts
          bValue = b.number_of_contracts
          break
        case 'amount_spent':
          aValue = a.amount_spent
          bValue = b.amount_spent
          break
        case 'percent_spent':
          aValue = a.percent_of_total_budget_spent
          bValue = b.percent_of_total_budget_spent
          break
        default:
          return 0
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number)
      }
    })

    return sorted
  }

  const sortedRecords = getSortedRecords()

  // Get display name for the selected agency
  const getDisplayAgencyName = (): string | null => {
    // If selectedAgency is set, it's already a full name
    if (selectedAgency) {
      return selectedAgency
    }
    
    // If agencyName prop is provided, check if it's a code or full name
    if (agencyName) {
      // Check if it's a code that needs mapping (backward compatibility)
      const mappedName = Object.entries(AGENCY_CODE_MAP).find(([_, code]) => code === agencyName)?.[0]
      return mappedName || agencyName
    }
    
    return null
  }

  const displayAgencyName = getDisplayAgencyName()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Agency Budget Spend Down Analysis</h1>
        
        {/* Agency Selection Dropdown */}
        <div className="space-y-2">
          <label htmlFor="agency-select" className="text-sm font-medium text-foreground">
            Select Agency
          </label>
          <Select value={selectedAgency} onValueChange={handleAgencyChange} disabled={loading}>
            <SelectTrigger id="agency-select" className="w-full max-w-md" disabled={loading}>
              <SelectValue placeholder="Select an agency..." />
            </SelectTrigger>
            <SelectContent>
              {AGENCIES.map((agency) => (
                <SelectItem key={agency} value={agency}>
                  {agency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loading && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading agency data...
            </p>
          )}
        </div>

        {displayAgencyName ? (
          <h2 className="text-2xl font-semibold text-foreground">
            {displayAgencyName}
          </h2>
        ) : (
          <div className="text-lg text-muted-foreground italic">
            Please select an agency to view budget analysis
          </div>
        )}
      </div>

      {/* Department Overview */}
      {displayAgencyName && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {contractSizeData?.records && contractSizeData.records.length > 0 && contractSizeData.records[0].Services_Description ? (
                contractSizeData.records[0].Services_Description
              ) : (
                <>
                  {displayAgencyName} is responsible for managing and delivering essential public services across New York City. 
                  This agency oversees a diverse portfolio of contracts and procurement activities that support the City's 
                  operations and service delivery. The budget breakdown below provides detailed insights into contract categories, 
                  spending patterns, and budget utilization across various service areas. This analysis helps identify spending 
                  trends, contract distribution, and opportunities for budget optimization and strategic planning.
                </>
              )}
            </p>
          </CardContent>
        </Card>
      )}
      {/* Agency Financial Summary */}
      {budgetBreakdown && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-foreground">Agency Financial Summary</h3>
          
          {(() => {
            // Get Total Contract Budget from hardcoded values (from contract.csv)
            const totalContractBudget = displayAgencyName ? (FY26_CONTRACTS_BUDGET[displayAgencyName] || 0) : 0
            
            // Get Capital Budget (already in full amount, not thousands)
            const totalCapitalBudget = budgetBreakdown.capital_budget?.fy26_adopted || 0
            
            // Get FY26 Agency Budget from hardcoded values
            const fy26AgencyBudget = displayAgencyName ? (FY26_AGENCY_BUDGET[displayAgencyName] || 0) : 0
            
            // Format currency for display
            const formatBudgetAmount = (amount: number): string => {
              if (amount >= 1000000000) {
                return `$${(amount / 1000000000).toFixed(2)}B`
              } else if (amount >= 1000000) {
                return `$${(amount / 1000000).toFixed(2)}M`
              } else if (amount >= 1000) {
                return `$${(amount / 1000).toFixed(2)}K`
              } else {
                return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
            }
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
                  <CardContent className="p-7 space-y-2">
                    <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">FY26 Agency Budget</h4>
                    <div className="text-2xl font-bold text-foreground">
                      {formatBudgetAmount(fy26AgencyBudget)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
                  <CardContent className="p-7 space-y-2">
                    <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">Total Contract Budget</h4>
                    <div className="text-2xl font-bold text-foreground">
                      {formatBudgetAmount(totalContractBudget)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
                  <CardContent className="p-7 space-y-2">
                    <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">Total Capital Budget</h4>
                    <div className="text-2xl font-bold text-foreground">
                      {totalCapitalBudget > 0 ? formatBudgetAmount(totalCapitalBudget) : 'N/A'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })()}
        </div>
      )}
      {/* Agency Budget Overview */}
      <div className="space-y-6">
        {/* <h3 className="text-2xl font-semibold text-foreground">Agency Financial Summary</h3> */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetData.map((item, index) => {
            const isProjectMatch = item.category === "Park Operations & Maintenance"
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
                  <h4 className="font-semibold text-foreground text-lg">{item.category}</h4>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">{item.amount}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-primary">{item.percentage}</span>
                      <span className="text-sm text-muted-foreground">of total budget</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Budget Spending Breakdown */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-foreground">
          Agency Contract Budget Breakdown
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <sup className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted-foreground/30 cursor-help">
                  <span className="text-[10px] text-muted-foreground">?</span>
                </sup>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>In the NYC Office of Management and Budget framework, the Contract Budget reflects expected expense-level payments to vendors for contracted services during that fiscal year, not the total contract authorization or capital commitments.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agency Contract Budget */}
          <Card className="shadow-card">
            <CardContent className="flex items-center justify-center min-h-[280px] p-0">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                {(() => {
                  // Get Agency Contract Budget from hardcoded values (from contract.csv)
                  const agencyContractBudget = displayAgencyName ? (FY26_CONTRACTS_BUDGET[displayAgencyName] || 0) : 0
                  
                  // Format currency for display
                  const formatBudgetAmount = (amount: number): string => {
                    if (amount >= 1000000000) {
                      return `$${(amount / 1000000000).toFixed(2)}B`
                    } else if (amount >= 1000000) {
                      return `$${(amount / 1000000).toFixed(2)}M`
                    } else if (amount >= 1000) {
                      return `$${(amount / 1000).toFixed(2)}K`
                    } else {
                      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    }
                  }
                  
                  return (
                    <>
                      <div className="text-5xl font-bold text-foreground">
                        {agencyContractBudget > 0 ? formatBudgetAmount(agencyContractBudget) : 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">Agency Contract Budget</div>
                    </>
                  )
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Total Contract Outlays to Date */}
          <Card className="shadow-card">
            <CardContent className="flex items-center justify-center min-h-[280px] p-0">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                {(() => {
                  // Calculate total amount spent from all expense categories (amount_spent is in full dollars)
                  const totalAmountSpent = budgetBreakdown?.records 
                    ? budgetBreakdown.records.reduce((sum, item) => sum + item.amount_spent, 0)
                    : 0
                  
                  // Format currency for display
                  const formatBudgetAmount = (amount: number): string => {
                    if (amount >= 1000000000) {
                      return `$${(amount / 1000000000).toFixed(2)}B`
                    } else if (amount >= 1000000) {
                      return `$${(amount / 1000000).toFixed(2)}M`
                    } else if (amount >= 1000) {
                      return `$${(amount / 1000).toFixed(2)}K`
                    } else {
                      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    }
                  }
                  
                  return (
                    <>
                      <div className="text-5xl font-bold text-primary">
                        {totalAmountSpent > 0 ? formatBudgetAmount(totalAmountSpent) : '$0'}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Contract Outlays to Date</div>
                    </>
                  )
                })()}
              </div>
            </CardContent>
          </Card>

          {/* % of Total Contracts Budget Spent to Date */}
          <Card className="shadow-card">
            <CardContent className="flex items-center justify-center min-h-[280px] p-0">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                {(() => {
                  // Get Total Contract Budget from hardcoded values (from contract.csv)
                  const totalContractBudget = displayAgencyName ? (FY26_CONTRACTS_BUDGET[displayAgencyName] || 0) : 0
                  
                  // Calculate total amount spent from all expense categories
                  const totalAmountSpent = budgetBreakdown?.records 
                    ? budgetBreakdown.records.reduce((sum, item) => sum + item.amount_spent, 0)
                    : 0
                  
                  // Calculate percentage
                  const percentSpent = totalContractBudget > 0 
                    ? (totalAmountSpent / totalContractBudget) * 100 
                    : 0
                  const percentRemaining = 100 - percentSpent
                  
                  return (
                    <>
                      <div className="relative">
                        <PieChart width={180} height={180}>
                          <Pie
                            data={[
                              { name: 'Spent', value: percentSpent },
                              { name: 'Remaining', value: percentRemaining }
                            ]}
                            cx={90}
                            cy={90}
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            <Cell fill="hsl(var(--primary))" />
                            <Cell fill="hsl(var(--muted))" />
                          </Pie>
                        </PieChart>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-foreground">
                            {percentSpent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">% of Total Contracts Budget Spent to Date</div>
                    </>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="font-semibold cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-2">
                      Category
                      {sortColumn === 'category' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-semibold text-right cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('fy26_preliminary')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      FY26 Preliminary
                      {sortColumn === 'fy26_preliminary' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span 
                        className="cursor-pointer hover:bg-muted/50 transition-colors px-2 py-1 rounded flex items-center gap-2"
                        onClick={() => handleSort('number_of_contracts')}
                      >
                        Number of Contracts
                        {sortColumn === 'number_of_contracts' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <sup className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted-foreground/30 cursor-help">
                              <span className="text-[10px] text-muted-foreground">?</span>
                            </sup>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>All active contracts expected to receive payments in FY26 within each category—not just contracts newly executed or registered in FY 2026.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-semibold text-right cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('amount_spent')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Amount Spent
                      {sortColumn === 'amount_spent' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-semibold text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('percent_spent')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      % of Total Budget Spent
                      {sortColumn === 'percent_spent' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-50" />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading budget breakdown...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-destructive">
                      <p>Error: {error}</p>
                    </TableCell>
                  </TableRow>
                ) : !budgetBreakdown || sortedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {selectedAgency || agencyName ? (
                        <p>No budget breakdown data available for this agency.</p>
                      ) : (
                        <p>Please select an agency from the dropdown above to view budget breakdown data.</p>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {sortedRecords.map((item, index) => {
                      const fy26Formatted = formatToThousands(item.fy26_preliminary)
                      const amountSpentFormatted = formatToThousands(item.amount_spent)
                      return (
                        <TableRow key={index} className="font-medium">
                          <TableCell className="font-medium">
                            {item.category}
                          </TableCell>
                          <TableCell className="text-right">
                            {fy26Formatted}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(item.number_of_contracts)}
                          </TableCell>
                          <TableCell className="text-right">
                            {amountSpentFormatted}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <MiniDonutChart spent={amountSpentFormatted} total={fy26Formatted} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {/* Calculate and display totals */}
                    {sortedRecords.length > 0 && (() => {
                      // Get FY26 Preliminary total from hardcoded values (from contract.csv)
                      const totalFY26Preliminary = displayAgencyName ? (FY26_CONTRACTS_BUDGET[displayAgencyName] || 0) : 0
                      const totalAmountSpent = sortedRecords.reduce((sum, item) => sum + item.amount_spent, 0)
                      const totalNumberOfContracts = sortedRecords.reduce((sum, item) => sum + item.number_of_contracts, 0)
                      
                      return (
                        <TableRow className="border-t-2 font-bold">
                          <TableCell className="font-bold">TOTAL</TableCell>
                          <TableCell className="text-right font-bold">
                            {formatToThousands(totalFY26Preliminary)}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatNumber(totalNumberOfContracts)}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatToThousands(totalAmountSpent)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <MiniDonutChart
                                spent={formatToThousands(totalAmountSpent)}
                                total={formatToThousands(totalFY26Preliminary)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })()}
                  </>
                )}
              </TableBody>
            </Table>
            <div className="text-xs text-muted-foreground italic p-4 border-t">
              Source: New York City Office of Management and Budget
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agency Capital Budget Breakdown */}
      {budgetBreakdown?.capital_budget && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-foreground">Agency Capital Budget Breakdown</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Capital Budget */}
            <Card className="shadow-card">
              <CardContent className="flex items-center justify-center min-h-[280px] p-0">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <div className="text-5xl font-bold text-foreground">
                    ${(budgetBreakdown.capital_budget.fy26_adopted / 1000000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M
                  </div>
                  <div className="text-sm text-muted-foreground">Agency Capital Budget (FY26 Adopted)</div>
                </div>
              </CardContent>
            </Card>

            {/* Capital Outlays to Date */}
            <Card className="shadow-card">
              <CardContent className="flex items-center justify-center min-h-[280px] p-0">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <div className="text-5xl font-bold text-primary">
                    ${(budgetBreakdown.capital_budget.fy26_utilized / 1000000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M
                  </div>
                  <div className="text-sm text-muted-foreground">Capital Outlays to Date (FY26 Utilized)</div>
                </div>
              </CardContent>
            </Card>

            {/* Doughnut Chart */}
            <Card className="shadow-card">
              <CardContent className="flex items-center justify-center min-h-[280px] p-0">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <PieChart width={180} height={180}>
                      <Pie
                        data={[
                          { name: 'Spent', value: budgetBreakdown.capital_budget.percent_spent },
                          { name: 'Remaining', value: 100 - budgetBreakdown.capital_budget.percent_spent }
                        ]}
                        cx={90}
                        cy={90}
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="hsl(var(--primary))" />
                        <Cell fill="hsl(var(--muted))" />
                      </Pie>
                    </PieChart>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">
                        {budgetBreakdown.capital_budget.percent_spent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">% of total capital budget spent to date</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Top Capital Contracts */}
      {budgetBreakdown?.top_capital_contracts && budgetBreakdown.top_capital_contracts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-foreground">Top Capital Contracts</h3>
          
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Contract ID</TableHead>
                      <TableHead className="font-semibold">Purpose</TableHead>
                      <TableHead className="font-semibold">Contracting Agency</TableHead>
                      <TableHead className="font-semibold">Prime Vendor</TableHead>
                      <TableHead className="font-semibold text-right">YTD Spending</TableHead>
                      <TableHead className="font-semibold text-right">Total Contract Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetBreakdown.top_capital_contracts.map((contract, index) => (
                      <TableRow key={contract.contract_id || index}>
                        <TableCell className="font-medium">{contract.contract_id || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs">{contract.purpose || 'N/A'}</TableCell>
                        <TableCell>{contract.contracting_agency || 'N/A'}</TableCell>
                        <TableCell className="font-medium max-w-xs">{contract.prime_vendor || 'N/A'}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {contract.ytd_spending ? formatCurrency(contract.ytd_spending) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {contract.total_contract_amount ? formatCurrency(contract.total_contract_amount) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}