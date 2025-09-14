import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Home,
  Search,
  Building,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  Menu
} from "lucide-react"

const navigation = [
  { name: "Dashboard", icon: Home, current: true },
  { name: "Discovery", icon: Search, current: false },
  { name: "Agencies", icon: Building, current: false },
  { name: "Analytics", icon: BarChart3, current: false },
  { name: "Predictions", icon: TrendingUp, current: false },
  { name: "Procurement", icon: Users, current: false },
  { name: "Reports", icon: FileText, current: false },
  { name: "Settings", icon: Settings, current: false },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div 
      className={cn(
        "flex flex-col bg-card border-r border-border shadow-card transition-smooth",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-semibold text-foreground text-sm">OBA Analytics</span>
              <p className="text-xs text-muted-foreground">Government Insights</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.name}
              variant={item.current ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11 transition-smooth",
                collapsed && "px-2",
                item.current && "gradient-primary text-white shadow-md"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </Button>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        {!collapsed && (
          <div className="text-xs text-muted-foreground text-center">
            Government Analytics Platform
          </div>
        )}
      </div>
    </div>
  )
}