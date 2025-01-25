"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Hospital, Users, Calendar, UserPlus, List, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "../ui/separator"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Hospital,
  },
  {
    title: "Queue",
    href: "/queue",
    icon: List,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Doctors",
    href: "/doctors",
    icon: Users,
  },
  {
    title: "Patients",
    href: "/patients",
    icon: UserPlus,
  },
]

export function MainNav({ setOpen }: { setOpen?: (open: boolean) => void }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const handleLinkClick = () => {
    if (setOpen) {
      setOpen(false)
    }
  }

  return (
    <nav className="flex flex-col space-y-2">
      {mainNavItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleLinkClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
      <Separator />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-full justify-start px-3 py-2"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="ml-3">Toggle theme</span>
      </Button>
      <button
        onClick={() => {
          localStorage.removeItem("token")
          window.location.href = "/login"
        }}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors mt-auto"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </nav>
  )
}

