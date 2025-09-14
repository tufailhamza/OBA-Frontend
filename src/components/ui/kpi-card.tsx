import { cn } from "@/lib/utils"
import { Card, CardContent } from "./card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  subtitle?: string
  className?: string
  gradient?: boolean
}

export function KpiCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  subtitle,
  className,
  gradient = false
}: KpiCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-success"
      case "negative":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getChangeIcon = () => {
    if (changeType === "positive") return TrendingUp
    if (changeType === "negative") return TrendingDown
    return null
  }

  const ChangeIcon = getChangeIcon()

  return (
    <Card 
      className={cn(
        "shadow-card hover:shadow-hover transition-smooth border-0",
        gradient && "gradient-card",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {value}
              </p>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                getChangeColor()
              )}>
                {ChangeIcon && <ChangeIcon className="h-4 w-4" />}
                {change}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}