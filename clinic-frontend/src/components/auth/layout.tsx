import { ThemeToggler } from "../ThemeToggler";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
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
          <ThemeToggler />
        </header>
        <main>{children}</main>
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Designed and developed by{" "}
            <span className="text-primary">Roopsagar K</span>
          </p>
          <p className="underline">
            Building projects, one line of code at a time.
          </p>
        </footer>
      </div>
    </div>
  );
}
