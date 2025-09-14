import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

export function Filters() {
  return (
    <Card className="gradient-card shadow-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Search Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Keyword Search */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Keyword Search (Services Description)
          </label>
          <div className="relative">
            <Input 
              className="bg-background/50 pr-8" 
              placeholder=""
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Fiscal Year */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Fiscal Year
          </label>
          <div className="flex gap-2 mb-2">
            <Badge variant="default" className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
              2025
              <X className="h-3 w-3 cursor-pointer" />
            </Badge>
          </div>
          <Select>
            <SelectTrigger className="bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Agency */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Agency
          </label>
          <Select>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acs">ACS</SelectItem>
              <SelectItem value="dob">DOB</SelectItem>
              <SelectItem value="dept-tech">Department of Technology</SelectItem>
              <SelectItem value="dept-defense">Department of Defense</SelectItem>
              <SelectItem value="dept-health">Department of Health</SelectItem>
              <SelectItem value="dept-education">Department of Education</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Procurement Method */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Procurement Method
          </label>
          <Select>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="competitive-bid">Competitive Sealed Bid</SelectItem>
              <SelectItem value="task-order">Task Order</SelectItem>
              <SelectItem value="mwbe-small">MWBE Noncompetitive Small Purchase</SelectItem>
              <SelectItem value="sole-source">Sole Source</SelectItem>
              <SelectItem value="rfp">Request for Proposal (RFP)</SelectItem>
              <SelectItem value="rfq">Request for Quote (RFQ)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fiscal Quarter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Fiscal Quarter
          </label>
          <Select>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Titles */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Job Titles
          </label>
          <Select>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chief">Chief</SelectItem>
              <SelectItem value="deputy-chief">Deputy Chief</SelectItem>
              <SelectItem value="captain">Captain</SelectItem>
              <SelectItem value="lieutenant">Lieutenant</SelectItem>
              <SelectItem value="sergeant">Sergeant</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button className="w-full mt-6">
          Search
        </Button>
      </CardContent>
    </Card>
  )
}