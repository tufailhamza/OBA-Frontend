import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


const budgetData = [
  {
    category: "Park Operations & Maintenance",
    amount: "$434.4",
    percentage: "65.1%",
    description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  },
  {
    category: "Personnel & Human Resources", 
    amount: "$411.4",
    percentage: "22.1%",
    description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  },
  {
    category: "Capital Infrastructure",
    amount: "$66.4", 
    percentage: "8.6%",
    description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  },
  {
    category: "Environmental Conservation",
    amount: "$32.1",
    percentage: "6.3%", 
    description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  },
  {
    category: "Community Programs & Services",
    amount: "$20.6",
    percentage: "4.7%",
    description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  },
  {
    category: "Administrative & Support",
    amount: "$6.9",
    percentage: "2.1%",
    description: "Includes maintenance, cleaning, landscaping, utilities, safety"
  }
]

const spendingBreakdownData = [
  {
    category: "Park Operations & Maintenance",
    budgetTotal: "$434.4 Million",
    thirdPartyVended: "$43.44 Million", 
    vendorUtilization: "15.22%"
  },
  {
    category: "Personnel & Human Resources",
    budgetTotal: "$411.4 Million", 
    thirdPartyVended: "$41.14 Million",
    vendorUtilization: "22.32%"
  },
  {
    category: "Personnel & Human Resources",
    budgetTotal: "$411.4 Million",
    thirdPartyVended: "$41.14 Million", 
    vendorUtilization: "22.32%"
  }
]

export function AgencyAnalysis() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Agency Budget Spend Down Analysis</h1>
        <h2 className="text-2xl font-semibold text-foreground">Department of Parks & Recreation</h2>
      </div>

      {/* Department Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            The Department of Parks and Recreation (DPR or the Department) is responsible for managing 
            more than 30,000 acres of land across the City as well as providing activities and services within parks. DPR is also 
            responsible for trash collection, public safety, and infrastructure work within parks of all sizes.
          </p>
        </CardContent>
      </Card>

      {/* Agency Budget Overview */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-foreground">Agency Budget Overview</h3>
        
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
                      <span className="text-sm text-muted-foreground">Million</span>
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
        <h3 className="text-2xl font-semibold text-foreground">Budget Spending Breakdown</h3>
        
        <Card className="shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Budget Category</TableHead>
                <TableHead className="font-semibold">Budget Total</TableHead>
                <TableHead className="font-semibold">Budget Category - 3rd Party Vended</TableHead>
                <TableHead className="font-semibold">Budget Category Vendor Utilization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spendingBreakdownData.map((item, index) => {
                const isProjectMatch = item.category === "Park Operations & Maintenance"
                return (
                  <TableRow key={index} className={isProjectMatch ? "bg-primary/5 relative" : ""}>
                    <TableCell className="font-medium relative">
                      <div>{item.category}</div>
                    </TableCell>
                    <TableCell>{item.budgetTotal}</TableCell>
                    <TableCell>{item.thirdPartyVended}</TableCell>
                    <TableCell className="font-semibold text-primary relative">
                      <div className="flex items-center justify-between">
                        <span>{item.vendorUtilization}</span>
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
          <p className="text-sm text-muted-foreground">[Full list of budget categories...]</p>
        </div>
      </div>
    </div>
  )
}