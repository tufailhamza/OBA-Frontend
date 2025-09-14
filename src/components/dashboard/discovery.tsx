import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const procurementData = [
  {
    id: 83,
    fiscalYear: 2025,
    planId: "FY25NAC535",
    agency: "ACS",
    description: "Combined Armed and Unarmed Security Guards, Fire Safety staff",
    startDate: "7/1/24",
    endDate: "06/30/2027",
    method: "Competitive Sealed Bid",
    quarter: 2,
    jobTitles: "Chief: 1 Deputy Chief: 1 Captains: 1 Lieutenants: 3 Sergeant"
  },
  {
    id: 107,
    fiscalYear: 2025,
    planId: "FY25NAC560",
    agency: "ACS",
    description: "Combined Armed Security Guards, Unarmed Security Guards, and Fire Safety Person",
    startDate: "7/1/24",
    endDate: "06/30/2028",
    method: "Task Order",
    quarter: 3,
    jobTitles: "Lieutenants, Sergeants, Captains, Special Officers, Chief"
  },
  {
    id: 124,
    fiscalYear: 2025,
    planId: "FY25NAC577",
    agency: "ACS",
    description: "Psychological, Psychiatric and/or Fire Setting Evaluation",
    startDate: "7/1/24",
    endDate: "06/30/2026",
    method: "MWBE Noncompetitive Small Purchase",
    quarter: 4,
    jobTitles: "None"
  },
  {
    id: 175,
    fiscalYear: 2025,
    planId: "FY25NAC524",
    agency: "ACS",
    description: "Maintenance and services for all fire extinguishers at all ACS administrative sites in th",
    startDate: "7/1/2024",
    endDate: "06/30/2025",
    method: "Task Order",
    quarter: 1,
    jobTitles: "None"
  },
  {
    id: 185,
    fiscalYear: 2025,
    planId: "FY25NAC534",
    agency: "ACS",
    description: "Radio Batteries for the fire brigade.",
    startDate: "7/1/2024",
    endDate: "06/30/2025",
    method: "Task Order",
    quarter: 1,
    jobTitles: "None"
  },
  {
    id: 203,
    fiscalYear: 2025,
    planId: "FY25NAC552",
    agency: "ACS",
    description: "Maintenance and services to all Fire extinguishers service and Maintenace at our ACS",
    startDate: "7/1/2024",
    endDate: "06/30/2025",
    method: "Task Order",
    quarter: 1,
    jobTitles: "None"
  },
  {
    id: 227,
    fiscalYear: 2025,
    planId: "FY25NAC577",
    agency: "ACS",
    description: "Psychological, Psychiatric and/or Fire Setting Evaluation",
    startDate: "7/1/24",
    endDate: "06/30/2026",
    method: "MWBE Noncompetitive Small Purchase",
    quarter: 4,
    jobTitles: "None"
  },
  {
    id: 335,
    fiscalYear: 2025,
    planId: "FY25NDOB11",
    agency: "DOB",
    description: "Network Engineer to assist in the building and maintaining of the network infrastruct",
    startDate: "8/2/24",
    endDate: "08/01/2025",
    method: "Task Order",
    quarter: 1,
    jobTitles: "None"
  }
]

const awardData = [
  {
    agency: "Education",
    title: "REQUIREMENTS CONTRACT FOR REPAIR AND MAINTENANCE OF FIRE SUPPRESSION SYSTEM",
    awardDate: "2025-08 08 00:00:00",
    description: "Please note that bids can be submitted in hardcopy (paper) mail and electronic",
    category: "Solicitation",
    fiscalYear: 2025
  },
  {
    agency: "Information Technology and Telecommunications",
    title: "7-858-06TOA FIREWALL SPECIALIST, SP3 (8-7-858-05T2A)",
    awardDate: "2025-08 06 00:00:00",
    description: "",
    category: "Award",
    fiscalYear: 2025
  },
  {
    agency: "Citywide Administrative Services",
    title: "CITYWIDE PLUMBING AND FIRE SUPPRESSION RC - RENEWAL #1",
    awardDate: "2025-08 06 00:00:00",
    description: "Citywide Plumbing and Fire Suppression Requirements Contract for contro",
    category: "Award",
    fiscalYear: 2025
  },
  {
    agency: "Correction",
    title: "CONSULTING SERVICES FOR FIRE AND LIFE SAFETY COMPLIANCE",
    awardDate: "2025-08 19 00:00:00",
    description: "Per Section 3-04 (b)(2)(i)(A) of the Procurement Policy Board Rules, the New",
    category: "Intent to Award",
    fiscalYear: 2025
  },
  {
    agency: "Police Department",
    title: "FIRE ALARM SYSTEMS MAINTENANCE 1 POLICE PLAZA",
    awardDate: "2025-07 28 00:00:00",
    description: "",
    category: "Award",
    fiscalYear: 2025
  }
]

export function Discovery() {
  const navigate = useNavigate()
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const totalResults = 573
  const resultsPerPage = 50

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(procurementData.map(item => item.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id])
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Procurement Opportunity Discovery</h1>
        <p className="text-muted-foreground">Pinpoint Commercial Opportunities with the City of New York</p>
      </div>

      {/* Citywide Procurement Opportunities */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Citywide Procurement Opportunities</h2>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Your keyword search found {totalResults} results:</p>
          <p className="text-sm text-muted-foreground">
            Showing results {(currentPage - 1) * resultsPerPage + 1} to {Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults}:
          </p>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedRows.length === procurementData.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Select</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Fiscal Year</TableHead>
                <TableHead>PlanID</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Services Description</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Procurement Method</TableHead>
                <TableHead>Fiscal Quarter</TableHead>
                <TableHead>Job Titles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {procurementData.map((item) => (
                <TableRow 
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/procurement/${item.planId}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedRows.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.fiscalYear}</TableCell>
                  <TableCell>{item.planId}</TableCell>
                  <TableCell>{item.agency}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>{item.startDate}</TableCell>
                  <TableCell>{item.endDate}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>{item.quarter}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.jobTitles}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.ceil(totalResults / resultsPerPage)}
          </span>
          <Button 
            variant="outline"
            onClick={() => setCurrentPage(Math.min(Math.ceil(totalResults / resultsPerPage), currentPage + 1))}
            disabled={currentPage === Math.ceil(totalResults / resultsPerPage)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* NYC Government Procurement Awards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">NYC Government Procurement Awards</h2>
        
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Award Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Fiscal Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {awardData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{item.agency}</TableCell>
                  <TableCell className="max-w-md">{item.title}</TableCell>
                  <TableCell>{item.awardDate}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.fiscalYear}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}