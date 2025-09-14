import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Bell, 
  Settings
} from "lucide-react"

export function Header() {
  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-card">
      <div className="flex items-center justify-between">
        {/* Title and Breadcrumb */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Real-time
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Overview of key performance indicators and metrics
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search analytics..." 
              className="pl-10 bg-muted/50 border-0 focus:bg-background"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
                3
              </span>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}