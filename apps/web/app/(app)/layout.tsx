"use client";

import Link from "next/link";
import { Home, PenLine, User, Settings, Search } from "lucide-react";
import { AppNavLink } from "@/components/app-nav-link";
import { AuthGuard } from "@/components/auth-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/feed" className="text-lg font-medium text-foreground">
              entrelinhas
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/search"
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Buscar</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-20 pb-24">{children}</main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50">
          <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-around">
            <AppNavLink
              href="/feed"
              icon={<Home className="h-5 w-5" />}
              label="Início"
            />
            <AppNavLink
              href="/new"
              icon={<PenLine className="h-5 w-5" />}
              label="Escrever"
            />
            <AppNavLink
              href="/profile"
              icon={<User className="h-5 w-5" />}
              label="Perfil"
            />
            <AppNavLink
              href="/settings"
              icon={<Settings className="h-5 w-5" />}
              label="Ajustes"
            />
          </div>
        </nav>
      </div>
    </AuthGuard>
  );
}
