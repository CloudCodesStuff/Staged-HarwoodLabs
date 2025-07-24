"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  MoreHorizontal,
  Users,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  Search,
  MessageSquare,
  Mail,
  FileText,
  Star,
  BarChart3,
} from "lucide-react"
import { useState, useMemo } from "react"

// --- DATA
const widgetsData = [
  {
    id: "1",
    name: "Newsletter Signup",
    responses: 1243,
    views: 12847,
    lastUpdated: new Date(new Date().setDate(new Date().getDate() - 1)),
    type: "newsletter",
    color: "#0070f3",
  },
  {
    id: "2",
    name: "Product Feedback",
    responses: 867,
    views: 8234,
    lastUpdated: new Date(new Date().setDate(new Date().getDate() - 2)),
    type: "feedback",
    color: "#00a0e9",
  },
  {
    id: "3",
    name: "Contact Form",
    responses: 456,
    views: 5643,
    lastUpdated: new Date(new Date().setDate(new Date().getDate() - 5)),
    type: "contact",
    color: "#00b5c6",
  },
  {
    id: "4",
    name: "Beta Signup Form",
    responses: 234,
    views: 2847,
    lastUpdated: new Date(new Date().setDate(new Date().getDate() - 10)),
    type: "signup",
    color: "#00c781",
  },
  {
    id: "5",
    name: "User Satisfaction Survey",
    responses: 47,
    views: 623,
    lastUpdated: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    type: "survey",
    color: "#00d66a",
  },
]
const recentSubmissions = [
  { widget: "Newsletter Signup", user: "john@example.com", time: "2 min ago" },
  { widget: "Product Feedback", user: "sarah@company.com", time: "15 min ago" },
  { widget: "Contact Form", user: "mike@startup.io", time: "1 hour ago" },
  { widget: "Beta Signup Form", user: "anna@tech.com", time: "2 hours ago" },
  { widget: "Newsletter Signup", user: "david@email.com", time: "3 hours ago" },
  { widget: "Contact Form", user: "lisa@business.net", time: "5 hours ago" },
  { widget: "Product Feedback", user: "tom@agency.co", time: "6 hours ago" },
  { widget: "Beta Signup Form", user: "emma@dev.io", time: "8 hours ago" },
  { widget: "Newsletter Signup", user: "alex@mail.com", time: "10 hours ago" },
  { widget: "Contact Form", user: "jane@corp.net", time: "12 hours ago" },
]

// --- MAIN COMPONENT
export function DashboardOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const filteredAndSortedWidgets = useMemo(() => {
    return widgetsData
      .filter((widget) => widget.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return b.lastUpdated.getTime() - a.lastUpdated.getTime()
        }
        if (sortOrder === "oldest") {
          return a.lastUpdated.getTime() - b.lastUpdated.getTime()
        }
        if (sortOrder === "name") {
          return a.name.localeCompare(b.name)
        }
        return 0
      })
  }, [searchTerm, sortOrder])

  return (
    <div className="w-full h-screen bg-background p-6 overflow-hidden">
      <div className="flex gap-8 h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 flex-shrink-0">
            <div>
              <h1 className="text-4xl font-bold text-primary">Hello, Eashaan 👋</h1>
              <p className="text-muted-foreground mt-2 text-lg">Manage your widgets and track performance</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Widget
              </Button>
            </div>
          </div>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-shrink-0">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search widgets..."
                className="pl-9 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-base">
                  {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder("newest")}>Newest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("oldest")}>Oldest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("name")}>Name</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {/* Create Card */}
              <div className="border border-border rounded-lg hover:bg-muted/10 transition-colors cursor-pointer shadow-md">
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-muted-foreground text-lg">Create Widget</span>
                  </div>
                </div>
              </div>
              {/* Widget Cards */}
              {filteredAndSortedWidgets.map((widget) => (
                <WidgetCard key={widget.id} widget={widget} />
              ))}
            </div>
          </div>
        </div>
        {/* Recent Submissions Sidebar */}
        <div className="w-80 hidden lg:flex flex-col flex-shrink-0">
          <div className="border border-border rounded-lg bg-card h-full flex flex-col">
            <div className="p-6 border-b border-border flex-shrink-0">
              <h2 className="text-xl font-semibold">Recent Submissions</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {recentSubmissions.map((submission, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4 hover:bg-muted/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base truncate">{submission.widget}</p>
                        <p className="text-muted-foreground text-sm mt-1 truncate">{submission.user}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{submission.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WidgetCard({ widget }: { widget: any }) {
  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    let interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutes ago"
    return "just now"
  }

  const getWidgetIcon = (type: any) => {
    switch (type) {
      case "newsletter":
        return Mail
      case "feedback":
        return MessageSquare
      case "contact":
        return Users
      case "signup":
        return Star
      case "survey":
        return BarChart3
      default:
        return FileText
    }
  }

  const Icon = getWidgetIcon(widget.type)

  return (
    <div className="group border border-border rounded-lg hover:bg-muted/10 transition-colors cursor-pointer shadow-md">
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(to right, ${widget.color}, ${widget.color}80)`,
        }}
      />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${widget.color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color: widget.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{widget.name}</h3>
              <p className="text-muted-foreground mt-1 text-base">Edited {timeSince(widget.lastUpdated)}</p>
              <div className="flex items-center gap-6 mt-3 text-base text-muted-foreground">
                <span>{widget.responses.toLocaleString()} responses</span>
                <span>{widget.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview