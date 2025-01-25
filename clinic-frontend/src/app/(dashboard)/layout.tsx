"use client"

import { MainNav } from "@/components/layout/main-nav"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 flex-col gap-4 border-r bg-muted/40 p-6">
        <div className="flex h-14 items-center gap-2 border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="block text-xl text-foreground dark:text-card-foreground group-hover:text-muted-foreground dark:group-hover:text-muted-foreground transition-colors duration-200 mb-2">
              <span className="text-muted-foreground dark:text-muted-foreground">allo</span>
              <span className="font-bold text-primary dark:text-primary-foreground">Health</span>
            </span>
          </div>
        </div>
        <MainNav />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          <div className="md:hidden mb-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-14 items-center gap-2 border-b p-4">
                  <span className="block text-xl text-foreground dark:text-card-foreground group-hover:text-muted-foreground dark:group-hover:text-muted-foreground transition-colors duration-200">
                    <span className="text-muted-foreground dark:text-muted-foreground">allo</span>
                    <span className="font-bold text-primary dark:text-primary-foreground">Health</span>
                  </span>
                </div>
                <MainNav />
              </SheetContent>
            </Sheet>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}

