import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Mail, BookOpen, MessagesSquare, Menu, X, Feather } from "lucide-react";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/chat", label: "Workplace Chat", icon: MessagesSquare },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const current = NAV.find((n) => n.to === pathname)?.label ?? "";

  return (
    <div className="min-h-screen md:flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-sidebar p-5 transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-gradient"><Feather className="h-4 w-4 text-primary" /></span>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold">Workplace</p>
            <p className="text-xs text-muted-foreground">Productivity Assistant</p>
          </div>
          <button className="ml-auto md:hidden" aria-label="Close menu" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav aria-label="Main" className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-card text-foreground shadow-sm border border-border" }}
              activeOptions={{ exact: true }}>
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <p className="absolute bottom-5 left-5 right-5 rounded-xl bg-gold-soft p-3 text-xs text-accent-foreground">
          Demo mode: responses come from built-in rules in your browser, not an AI model.
        </p>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/20 md:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-8">
          <button className="md:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <h2 className="text-lg font-semibold">{current}</h2>
          <span className="ml-auto rounded-full bg-blush px-3 py-1 text-xs font-semibold text-primary">Demo</span>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
        <footer className="px-4 pb-6 text-center text-xs text-muted-foreground md:px-8">
          Outputs may contain errors. Review all content before professional use.
        </footer>
      </div>
    </div>
  );
}

export function PageIntro({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
      <p className="mt-1 text-muted-foreground">{text}</p>
    </div>
  );
}
