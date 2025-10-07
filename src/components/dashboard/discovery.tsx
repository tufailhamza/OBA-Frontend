import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  searchProcurement, 
  searchAwards,
  type ProcurementSearchFilters,
  type ProcurementRecord,
  type AwardRecord
} from "@/services/api"

export function Discovery({ searchFilters }: { searchFilters?: ProcurementSearchFilters }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // State for procurement data
  const [procurementData, setProcurementData] = useState<ProcurementRecord[]>([])
  const [procurementLoading, setProcurementLoading] = useState(false)
  const [procurementError, setProcurementError] = useState<string | null>(null)
  const [procurementTotal, setProcurementTotal] = useState(0)
  const [procurementCurrentPage, setProcurementCurrentPage] = useState(1)
  const [procurementTotalPages, setProcurementTotalPages] = useState(0)
  
  // State for awards data
  const [awardData, setAwardData] = useState<AwardRecord[]>([])
  const [awardsLoading, setAwardsLoading] = useState(false)
  const [awardsError, setAwardsError] = useState<string | null>(null)
  const [awardsTotal, setAwardsTotal] = useState(0)
  const [awardsCurrentPage, setAwardsCurrentPage] = useState(1)
  const [awardsTotalPages, setAwardsTotalPages] = useState(0)
  
  // UI state
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Load procurement data
  const loadProcurementData = async (filters: ProcurementSearchFilters, page = 1) => {
    setProcurementLoading(true)
    setProcurementError(null)
    
    try {
      const response = await searchProcurement({
        ...filters,
        page,
        page_size: 50
      })
      
      setProcurementData(response.records)
      setProcurementTotal(response.total_count)
      setProcurementCurrentPage(response.page)
      setProcurementTotalPages(response.total_pages)
    } catch (error) {
      setProcurementError(error instanceof Error ? error.message : 'Failed to load procurement data')
      toast({
        title: "Error",
        description: "Failed to load procurement data",
        variant: "destructive"
      })
    } finally {
      setProcurementLoading(false)
    }
  }

  // Load awards data
  const loadAwardsData = async (page = 1, keyword?: string, agency?: string) => {
    setAwardsLoading(true)
    setAwardsError(null)
    
    try {
      // Awards API requires at least one of keyword or agency
      // Use provided keyword, or fallback to "a" for initial load
      const searchKeyword = keyword || "a"
      const response = await searchAwards(searchKeyword, agency, page, 50)
      
      
      setAwardData(response.records)
      setAwardsTotal(response.total_count)
      setAwardsCurrentPage(response.page)
      setAwardsTotalPages(response.total_pages)
    } catch (error) {
      setAwardsError(error instanceof Error ? error.message : 'Failed to load awards data')
      toast({
        title: "Error",
        description: "Failed to load awards data",
        variant: "destructive"
      })
    } finally {
      setAwardsLoading(false)
    }
  }

  // Effect to load data when search filters change
  useEffect(() => {
    if (searchFilters) {
      setHasSearched(true)
      loadProcurementData(searchFilters)
      // Also load awards data with the search keyword
      loadAwardsData(1, searchFilters.keyword, searchFilters.agency)
    }
  }, [searchFilters])

  // Preserve data when component unmounts/remounts by storing in sessionStorage
  useEffect(() => {
    const savedProcurementData = sessionStorage.getItem('discovery-procurement-data')
    const savedAwardData = sessionStorage.getItem('discovery-award-data')
    const savedHasSearched = sessionStorage.getItem('discovery-has-searched')
    
    if (savedProcurementData && !procurementData.length) {
      try {
        setProcurementData(JSON.parse(savedProcurementData))
        setHasSearched(savedHasSearched === 'true')
      } catch (error) {
        console.error('Error parsing saved procurement data:', error)
      }
    }
    
    if (savedAwardData && !awardData.length) {
      try {
        setAwardData(JSON.parse(savedAwardData))
      } catch (error) {
        console.error('Error parsing saved award data:', error)
      }
    }
  }, [])

  // Save data to sessionStorage when it changes
  useEffect(() => {
    if (procurementData.length > 0) {
      sessionStorage.setItem('discovery-procurement-data', JSON.stringify(procurementData))
    }
  }, [procurementData])

  useEffect(() => {
    if (awardData.length > 0) {
      sessionStorage.setItem('discovery-award-data', JSON.stringify(awardData))
    }
  }, [awardData])

  useEffect(() => {
    sessionStorage.setItem('discovery-has-searched', hasSearched.toString())
  }, [hasSearched])

  // Load awards data on component mount
  useEffect(() => {
    loadAwardsData()
  }, [])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(procurementData.map(item => item.ID))
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

  const handleProcurementPageChange = (page: number) => {
    if (searchFilters) {
      setProcurementCurrentPage(page)
      loadProcurementData(searchFilters, page)
    }
  }

  const handleAwardsPageChange = (page: number) => {
    setAwardsCurrentPage(page)
    // Pass current search filters to maintain search context
    const keyword = searchFilters?.keyword || "a"
    const agency = searchFilters?.agency
    loadAwardsData(page, keyword, agency)
  }

  // Show blank state if no search has been performed
  if (!hasSearched) {
    return (
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Procurement Opportunity Discovery</h1>
          <p className="text-muted-foreground">Pinpoint Commercial Opportunities with the City of New York</p>
        </div>

        {/* Blank State */}
        <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">No Search Performed</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Use the search filters in the sidebar to find procurement opportunities. 
                Enter keywords, select agencies, or choose other criteria to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
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
          <p className="text-sm text-muted-foreground">Your keyword search found {procurementTotal} results:</p>
          {procurementData.length > 0 && (
          <p className="text-sm text-muted-foreground">
              Showing results {(procurementCurrentPage - 1) * 50 + 1} to {Math.min(procurementCurrentPage * 50, procurementTotal)} of {procurementTotal}:
          </p>
          )}
        </div>

        <Card>
          {procurementLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">Loading procurement data...</span>
              </div>
            </div>
          ) : procurementError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
                <p className="text-destructive">{procurementError}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                        checked={selectedRows.length === procurementData.length && procurementData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                    <TableHead className="font-sans text-sm w-32 min-w-32">Plan ID</TableHead>
                    <TableHead className="font-sans text-sm w-24 min-w-24">Agency</TableHead>
                    <TableHead className="font-sans text-sm w-64 min-w-64">Services Description</TableHead>
                    <TableHead className="font-sans text-sm w-24 min-w-24">Start Date</TableHead>
                    <TableHead className="font-sans text-sm w-24 min-w-24">End Date</TableHead>
                    <TableHead className="font-sans text-sm w-32 min-w-32">Procurement Method</TableHead>
                    <TableHead className="font-sans text-sm w-20 min-w-20">Fiscal Quarter</TableHead>
                    <TableHead className="font-sans text-sm w-48 min-w-48">Job Titles</TableHead>
                    <TableHead className="font-sans text-sm w-20 min-w-20">Head Count</TableHead>
                    <TableHead className="font-sans text-sm w-24 min-w-24">Data Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {procurementData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        No procurement opportunities found
                      </TableCell>
                    </TableRow>
                  ) : (
                    procurementData.map((item) => (
                <TableRow 
                        key={item.ID}
                  className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/procurement/${item.PlanID}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                            checked={selectedRows.includes(item.ID)}
                            onCheckedChange={(checked) => handleSelectRow(item.ID, checked as boolean)}
                    />
                  </TableCell>
                        <TableCell className="font-sans text-sm">{item.PlanID}</TableCell>
                        <TableCell className="font-sans text-sm">{item.Agency}</TableCell>
                        <TableCell className="font-sans text-sm" title={item.Services_Description || 'N/A'}>
                          {item.Services_Description || 'N/A'}
                        </TableCell>
                        <TableCell className="font-sans text-sm">{item.Start_Date || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm">{item.End_Date || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm">{item.Procurement_Method || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm">{item.Fiscal_Quarter || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm" title={item.Job_Titles || 'N/A'}>
                          {item.Job_Titles || 'N/A'}
                        </TableCell>
                        <TableCell className="font-sans text-sm text-center">{item.Head_Count || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm">{item.Data_Source}</TableCell>
                </TableRow>
                    ))
                  )}
            </TableBody>
          </Table>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {procurementTotalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
              onClick={() => handleProcurementPageChange(procurementCurrentPage - 1)}
              disabled={procurementCurrentPage === 1 || procurementLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
              Page {procurementCurrentPage} of {procurementTotalPages}
          </span>
          <Button 
            variant="outline"
              onClick={() => handleProcurementPageChange(procurementCurrentPage + 1)}
              disabled={procurementCurrentPage === procurementTotalPages || procurementLoading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        )}

        {/* User Selected Records */}
        {selectedRows.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">User Selected Records:</h3>
            <Card>
              <div className="overflow-x-auto">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedRows.length === procurementData.length && procurementData.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="font-sans text-sm w-32 min-w-32">Plan ID</TableHead>
                      <TableHead className="font-sans text-sm w-24 min-w-24">Agency</TableHead>
                      <TableHead className="font-sans text-sm w-64 min-w-64">Services Description</TableHead>
                      <TableHead className="font-sans text-sm w-24 min-w-24">Start Date</TableHead>
                      <TableHead className="font-sans text-sm w-24 min-w-24">End Date</TableHead>
                      <TableHead className="font-sans text-sm w-32 min-w-32">Procurement Method</TableHead>
                      <TableHead className="font-sans text-sm w-20 min-w-20">Fiscal Quarter</TableHead>
                      <TableHead className="font-sans text-sm w-48 min-w-48">Job Titles</TableHead>
                      <TableHead className="font-sans text-sm w-20 min-w-20">Head Count</TableHead>
                      <TableHead className="font-sans text-sm w-24 min-w-24">Data Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {procurementData
                      .filter(item => selectedRows.includes(item.ID))
                      .map((item) => (
                        <TableRow key={item.ID}>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox 
                              checked={selectedRows.includes(item.ID)}
                              onCheckedChange={(checked) => handleSelectRow(item.ID, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell className="font-sans text-sm">{item.PlanID}</TableCell>
                          <TableCell className="font-sans text-sm">{item.Agency}</TableCell>
                          <TableCell className="font-sans text-sm" title={item.Services_Description || 'N/A'}>
                            {item.Services_Description || 'N/A'}
                          </TableCell>
                          <TableCell className="font-sans text-sm">{item.Start_Date || 'N/A'}</TableCell>
                          <TableCell className="font-sans text-sm">{item.End_Date || 'N/A'}</TableCell>
                          <TableCell className="font-sans text-sm">{item.Procurement_Method || 'N/A'}</TableCell>
                          <TableCell className="font-sans text-sm">{item.Fiscal_Quarter || 'N/A'}</TableCell>
                          <TableCell className="font-sans text-sm" title={item.Job_Titles || 'N/A'}>
                            {item.Job_Titles || 'N/A'}
                          </TableCell>
                          <TableCell className="font-sans text-sm text-center">{item.Head_Count || 'N/A'}</TableCell>
                          <TableCell className="font-sans text-sm">{item.Data_Source}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* NYC Government Procurement Awards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">NYC Government Procurement Awards</h2>
        
        <Card>
          {awardsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">Loading awards data...</span>
              </div>
            </div>
          ) : awardsError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
                <p className="text-destructive">{awardsError}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                 <TableHead className="font-sans text-sm w-24 min-w-24">Agency</TableHead>
                 <TableHead className="font-sans text-sm w-32 min-w-32">Title</TableHead>
                 <TableHead className="font-sans text-sm w-24 min-w-24">Award Date</TableHead>
                 <TableHead className="font-sans text-sm w-48 min-w-48">Description</TableHead>
                 <TableHead className="font-sans text-sm w-24 min-w-24">Category</TableHead>
                 <TableHead className="font-sans text-sm w-32 min-w-32">Agency Division</TableHead>
                 <TableHead className="font-sans text-sm w-24 min-w-24">Notice Type</TableHead>
                 <TableHead className="font-sans text-sm w-32 min-w-32">Contact Info</TableHead>
                 <TableHead className="font-sans text-sm w-24 min-w-24">Selection Method</TableHead>
                 <TableHead className="font-sans text-sm w-32 min-w-32">Vendor Info</TableHead>
                 <TableHead className="font-sans text-sm w-20 min-w-20">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {awardData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        No awards data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    awardData.map((item) => (
                      <TableRow key={item.ID}>
                         <TableCell className="font-sans text-sm" title={item.Agency || 'N/A'}>{item.Agency || 'N/A'}</TableCell>
                         <TableCell className="font-sans text-sm" title={item.Title || 'N/A'}>{item.Title || 'N/A'}</TableCell>
                         <TableCell className="font-sans text-sm">{item.Award_Date || 'N/A'}</TableCell>
                         <TableCell className="font-sans text-sm" title={item.Description || 'N/A'}>{item.Description || 'N/A'}</TableCell>
                         <TableCell className="font-sans text-sm">{item.Category || 'N/A'}</TableCell>
                         <TableCell className="font-sans text-sm" title={item.Agency_Division || 'N/A'}>{item.Agency_Division || 'N/A'}</TableCell>
                         <TableCell className="font-sans text-sm" title={item.Notice_Type || 'N/A'}>{item.Notice_Type || 'N/A'}</TableCell>
                         <TableCell className="font-sans text-sm" title={item.Contact_Information || 'N/A'}>{item.Contact_Information || 'N/A'}</TableCell>
                         <TableCell className="font-sans text-sm" title={item.Selection_Method || 'N/A'}>{item.Selection_Method || 'N/A'}</TableCell>
                         <TableCell className="font-sans text-sm" title={item.Vendor_Information || 'N/A'}>{item.Vendor_Information || 'N/A'}</TableCell>
                         <TableCell>
                          <span className={`px-1 py-0.5 rounded-full font-sans text-sm ${
                            item.Award_Status === 'YES' 
                              ? 'bg-success/10 text-success' 
                              : item.Award_Status === 'NO'
                              ? 'bg-destructive/10 text-destructive'
                              : item.Award_Status === 'Intent to Award'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {item.Award_Status || 'N/A'}
                          </span>
                        </TableCell>
                </TableRow>
                    ))
                  )}
            </TableBody>
          </Table>
            </div>
          )}
        </Card>

        {/* Awards Pagination */}
        {awardsTotalPages > 1 && (
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => handleAwardsPageChange(awardsCurrentPage - 1)}
              disabled={awardsCurrentPage === 1 || awardsLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {awardsCurrentPage} of {awardsTotalPages}
            </span>
            <Button 
              variant="outline"
              onClick={() => handleAwardsPageChange(awardsCurrentPage + 1)}
              disabled={awardsCurrentPage === awardsTotalPages || awardsLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* Keyword Matches Table */}
      {selectedRows.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Keyword Matches:</h2>
          <Card>
             <div className="overflow-auto w-full max-w-screen-2xl h-96 border rounded-md">
              <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                    <TableHead className="font-sans text-sm w-16">ID</TableHead>
                    <TableHead className="font-sans text-sm w-20">Fiscal Year</TableHead>
                    <TableHead className="font-sans text-sm w-24">Plan ID</TableHead>
                    <TableHead className="font-sans text-sm w-24">Agency</TableHead>
                    <TableHead className="font-sans text-sm w-40">Services Description</TableHead>
                    <TableHead className="font-sans text-sm w-24">Start Date</TableHead>
                    <TableHead className="font-sans text-sm w-24">End Date</TableHead>
                    <TableHead className="font-sans text-sm w-32">Procurement Method</TableHead>
                    <TableHead className="font-sans text-sm w-24">Fiscal Quarter</TableHead>
                    <TableHead className="font-sans text-sm w-32">Job Titles</TableHead>
                    <TableHead className="font-sans text-sm w-20">Head Count</TableHead>
                    <TableHead className="font-sans text-sm w-24">Data Source</TableHead>
                    <TableHead className="font-sans text-sm w-24">Source</TableHead>
                    <TableHead className="font-sans text-sm w-40">Title</TableHead>
                    <TableHead className="font-sans text-sm w-24">Award Date</TableHead>
                    <TableHead className="font-sans text-sm w-40">Description</TableHead>
                    <TableHead className="font-sans text-sm w-24">Category</TableHead>
                    <TableHead className="font-sans text-sm w-32">Agency Division</TableHead>
                    <TableHead className="font-sans text-sm w-24">Notice Type</TableHead>
                    <TableHead className="font-sans text-sm w-40">Contact Information</TableHead>
                    <TableHead className="font-sans text-sm w-32">Selection Method</TableHead>
                    <TableHead className="font-sans text-sm w-40">Vendor Information</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {/* Selected Procurement Records */}
                  {procurementData
                    .filter(item => selectedRows.includes(item.ID))
                    .map((item) => (
                      <TableRow key={`proc-${item.ID}`}>
                        <TableCell className="font-sans text-sm">{item.ID || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm">{item.Fiscal_Year || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm">{item.PlanID || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm max-w-20 truncate" title={item.Agency || 'N/A'}>{item.Agency || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm max-w-20 truncate" title={item.Services_Description || 'N/A'}>{item.Services_Description || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm">{item.Start_Date || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm">{item.End_Date || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm max-w-16 truncate" title={item.Procurement_Method || 'N/A'}>{item.Procurement_Method || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm">{item.Fiscal_Quarter || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm max-w-20 truncate" title={item.Job_Titles || 'N/A'}>{item.Job_Titles || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm">{item.Head_Count || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm">{item.Data_Source || 'N/A'}</TableCell>
                        <TableCell className="font-sans text-sm bg-blue-50">Procurement</TableCell>
                        <TableCell className="font-sans text-sm">N/A</TableCell>
                        <TableCell className="font-sans text-sm">N/A</TableCell>
                        <TableCell className="font-sans text-sm">N/A</TableCell>
                        <TableCell className="font-sans text-sm">N/A</TableCell>
                        <TableCell className="font-sans text-sm">N/A</TableCell>
                        <TableCell className="font-sans text-sm">N/A</TableCell>
                        <TableCell className="font-sans text-sm">N/A</TableCell>
                        <TableCell className="font-sans text-sm">N/A</TableCell>
                        <TableCell className="font-sans text-sm">N/A</TableCell>
                        <TableCell className="font-sans text-sm">N/A</TableCell>
                      </TableRow>
                    ))}
                  
                  {/* All Awards Records */}
                  {awardData.map((item) => (
                    <TableRow key={`award-${item.ID}`}>
                      <TableCell className="font-sans text-sm">N/A</TableCell>
                      <TableCell className="font-sans text-sm">N/A</TableCell>
                      <TableCell className="font-sans text-sm">N/A</TableCell>
                      <TableCell className="font-sans text-sm max-w-20 truncate" title={item.Agency || 'N/A'}>{item.Agency || 'N/A'}</TableCell>
                      <TableCell className="font-sans text-sm">N/A</TableCell>
                      <TableCell className="font-sans text-sm">N/A</TableCell>
                      <TableCell className="font-sans text-sm">N/A</TableCell>
                      <TableCell className="font-sans text-sm">N/A</TableCell>
                      <TableCell className="font-sans text-sm">N/A</TableCell>
                      <TableCell className="font-sans text-sm">N/A</TableCell>
                      <TableCell className="font-sans text-sm">N/A</TableCell>
                      <TableCell className="font-sans text-sm">N/A</TableCell>
                      <TableCell className="font-sans text-sm bg-green-50">Awards</TableCell>
                      <TableCell className="font-sans text-sm max-w-20 truncate" title={item.Title || 'N/A'}>{item.Title || 'N/A'}</TableCell>
                      <TableCell className="font-sans text-sm">{item.Award_Date || 'N/A'}</TableCell>
                      <TableCell className="font-sans text-sm max-w-20 truncate" title={item.Description || 'N/A'}>{item.Description || 'N/A'}</TableCell>
                      <TableCell className="font-sans text-sm">{item.Category || 'N/A'}</TableCell>
                      <TableCell className="font-sans text-sm max-w-16 truncate" title={item.Agency_Division || 'N/A'}>{item.Agency_Division || 'N/A'}</TableCell>
                      <TableCell className="font-sans text-sm max-w-16 truncate" title={item.Notice_Type || 'N/A'}>{item.Notice_Type || 'N/A'}</TableCell>
                      <TableCell className="font-sans text-sm max-w-20 truncate" title={item.Contact_Information || 'N/A'}>{item.Contact_Information || 'N/A'}</TableCell>
                      <TableCell className="font-sans text-sm max-w-16 truncate" title={item.Selection_Method || 'N/A'}>{item.Selection_Method || 'N/A'}</TableCell>
                      <TableCell className="font-sans text-sm max-w-20 truncate" title={item.Vendor_Information || 'N/A'}>{item.Vendor_Information || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </div>
        </Card>
      </div>
      )}
    </div>
  )
}