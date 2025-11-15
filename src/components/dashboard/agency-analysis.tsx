import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { KpiCard } from "@/components/ui/kpi-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell } from "recharts"
import { useState, useEffect } from "react"
import { getContractBudgetBreakdown, searchByContractSizePlanId, type ContractBudgetBreakdownResponse, type ContractSizeSearchResponse } from "@/services/api"
import { Loader2 } from "lucide-react"

const budgetData = [
  // {
  //   category: "311/NYC.gov",
  //   amount: "$66,311,000",
  //   percentage: "65.1%",
  //   description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  // },
  // {
  //   category: "911 Technical Operations", 
  //   amount: "$122,153,000",
  //   percentage: "22.1%",
  //   description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  // },
  // {
  //   category: "Administration and Operations",
  //   amount: "$67,405,000", 
  //   percentage: "8.6%",
  //   description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  // },
  // {
  //   category: "Mayor's Office of Media & Entertainment",
  //   amount: "$23,481",
  //   percentage: "6.3%", 
  //   description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  // },
  // {
  //   category: "NYC Cyber Command",
  //   amount: "$107,581,000",
  //   percentage: "4.7%",
  //   description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  // },
  // {
  //   category: "Technology Services",
  //   amount: "$356,267",
  //   percentage: "2.1%",
  //   description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  // }
]

const spendingBreakdownData = [
  {
    category: "Contractual Services General",
    fy26Preliminary: "$54,683",
    numberOfContracts: "105",
    amountSpent: "$42,150"
  },
  {
    category: "Telecommunications Maint",
    fy26Preliminary: "$455",
    numberOfContracts: "9",
    amountSpent: "$321"
  },
  {
    category: "Maint & Rep Motor Veh Equip",
    fy26Preliminary: "$3,428",
    numberOfContracts: "8",
    amountSpent: "$2,890"
  },
  {
    category: "Maint & Rep General",
    fy26Preliminary: "$1,132",
    numberOfContracts: "67",
    amountSpent: "$876"
  },
  {
    category: "Office Equipment Maintenance",
    fy26Preliminary: "$189",
    numberOfContracts: "26",
    amountSpent: "$145"
  },
  {
    category: "Data Processing Equipment",
    fy26Preliminary: "$0",
    numberOfContracts: "1",
    amountSpent: "$0"
  },
  {
    category: "Printing Contracts",
    fy26Preliminary: "$158",
    numberOfContracts: "5",
    amountSpent: "$112"
  },
  {
    category: "Cleaning Services",
    fy26Preliminary: "$25",
    numberOfContracts: "4",
    amountSpent: "$18"
  },
  {
    category: "Transportation Expenditures",
    fy26Preliminary: "$50",
    numberOfContracts: "2",
    amountSpent: "$35"
  },
  {
    category: "Economic Development",
    fy26Preliminary: "$1",
    numberOfContracts: "2",
    amountSpent: "$1"
  },
  {
    category: "Pay To Cultural Institutions",
    fy26Preliminary: "$8,032",
    numberOfContracts: "3",
    amountSpent: "$6,240"
  },
  {
    category: "Training Prgm City Employees",
    fy26Preliminary: "$164",
    numberOfContracts: "20",
    amountSpent: "$125"
  },
  {
    category: "Prof Serv Accting & Auditing",
    fy26Preliminary: "$0",
    numberOfContracts: "0",
    amountSpent: "$0"
  },
  {
    category: "Prof Serv Computer Services",
    fy26Preliminary: "$105",
    numberOfContracts: "1",
    amountSpent: "$78"
  },
  {
    category: "Prof Serv Other",
    fy26Preliminary: "$338",
    numberOfContracts: "29",
    amountSpent: "$267"
  },
  {
    category: "Education & Rec For Youth Prgm",
    fy26Preliminary: "$22",
    numberOfContracts: "1",
    amountSpent: "$16"
  },
  {
    category: "TOTAL",
    fy26Preliminary: "$68,781",
    numberOfContracts: "283",
    amountSpent: "$53,274"
  }
]

const AGENCIES = [
  "Administration for Children's Services",
  "Board of Elections",
  "City University of New York",
  "Civilian Complaint Review Board",
  "Commission on Human Rights",
  "Department for the Aging",
  "Department of Buildings",
  "Department of City Planning",
  "Department of Citywide Administrative Services",
  "Department of Consumer and Worker Protection",
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
  "Libraries",
  "NYC Taxi and Limousine Commission",
  "Office of Administrative Trials and Hearings"
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
  "Libraries": "NYPL",
  "NYC Taxi and Limousine Commission": "TLC",
  "Office of Administrative Trials and Hearings": "OATH"
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
    <div className="flex items-center gap-2">
      <PieChart width={40} height={40}>
        <Pie
          data={data}
          cx={20}
          cy={20}
          innerRadius={12}
          outerRadius={18}
          paddingAngle={0}
          dataKey="value"
        >
          <Cell fill="hsl(var(--primary))" />
          <Cell fill="hsl(var(--muted))" />
        </Pie>
      </PieChart>
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

  const handleAgencyChange = (agency: string) => {
    if (onAgencyChange) {
      onAgencyChange(agency)
    }
  }

  // Fetch budget breakdown when agency is selected from dropdown
  useEffect(() => {
    if (!selectedAgency) {
      setBudgetBreakdown(null)
      return
    }

    const fetchBudgetBreakdown = async () => {
      setLoading(true)
      setError(null)
      try {
        // Convert full agency name to code for API call
        const agencyCode = AGENCY_CODE_MAP[selectedAgency] || selectedAgency
        const data = await getContractBudgetBreakdown(agencyCode)
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

  // Format number to thousands with comma separators
  const formatToThousands = (value: number): string => {
    const thousands = value / 1000
    return `$${thousands.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  // Format number with comma separators (for contract counts)
  const formatNumber = (value: number): string => {
    return value.toLocaleString('en-US')
  }

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
          <Select value={selectedAgency} onValueChange={handleAgencyChange}>
            <SelectTrigger id="agency-select" className="w-full max-w-md">
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
        
        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="text-sm text-muted-foreground italic p-4 border-b">
              Dollars in Thousands
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold text-right">FY26 Preliminary</TableHead>
                  <TableHead className="font-semibold text-right">
                    <div className="flex items-center justify-end gap-1">
                      Number of Contracts
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
                  <TableHead className="font-semibold text-right">Amount Spent</TableHead>
                  <TableHead className="font-semibold text-center">% of Total Budget Spent</TableHead>
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
                ) : !budgetBreakdown || budgetBreakdown.records.length === 0 ? (
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
                    {budgetBreakdown.records.map((item, index) => {
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
                    {budgetBreakdown.records.length > 0 && (
                      <TableRow className="border-t-2 font-bold">
                        <TableCell className="font-bold">TOTAL</TableCell>
                        <TableCell className="text-right font-bold">
                          {formatToThousands(
                            budgetBreakdown.records.reduce((sum, item) => sum + item.fy26_preliminary, 0)
                          )}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatNumber(
                            budgetBreakdown.records.reduce((sum, item) => sum + item.number_of_contracts, 0)
                          )}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatToThousands(
                            budgetBreakdown.records.reduce((sum, item) => sum + item.amount_spent, 0)
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <MiniDonutChart
                              spent={formatToThousands(
                                budgetBreakdown.records.reduce((sum, item) => sum + item.amount_spent, 0)
                              )}
                              total={formatToThousands(
                                budgetBreakdown.records.reduce((sum, item) => sum + item.fy26_preliminary, 0)
                              )}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
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
          <h3 className="text-2xl font-semibold text-foreground">Top Capital Contracts Issued to Date</h3>
          
          <Card className="shadow-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Contract type</TableHead>
                    <TableHead className="font-semibold">Purpose</TableHead>
                    <TableHead className="font-semibold">Industry</TableHead>
                    <TableHead className="font-semibold text-right">Current Amount</TableHead>
                    <TableHead className="font-semibold">Award Method</TableHead>
                    <TableHead className="font-semibold">Vendor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetBreakdown.top_capital_contracts.map((contract, index) => (
                    <TableRow key={index}>
                      <TableCell>{contract.contract_type}</TableCell>
                      <TableCell>{contract.purpose}</TableCell>
                      <TableCell>{contract.industry}</TableCell>
                      <TableCell className="text-right">
                        ${contract.current_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{contract.award_method}</TableCell>
                      <TableCell className="font-medium">{contract.vendor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}