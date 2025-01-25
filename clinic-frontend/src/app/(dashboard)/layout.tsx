import { MainNav } from "@/components/layout/main-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 flex-col gap-4 border-r bg-muted/40 p-6">
        <div className="flex h-14 items-center gap-2 border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="block text-xl text-foreground dark:text-card-foreground group-hover:text-muted-foreground dark:group-hover:text-muted-foreground transition-colors duration-200 mb-2">
              <span className="text-muted-foreground dark:text-muted-foreground">
                allo
              </span>
              <span className="font-bold text-primary dark:text-primary-foreground">
                Health
              </span>
            </span>
          </div>
        </div>
        <MainNav />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
