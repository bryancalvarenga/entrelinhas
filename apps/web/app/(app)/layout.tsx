"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, PenLine, User, Settings, Search, Bell, MessageSquare } from "lucide-react";
import { AppNavLink } from "@/components/app-nav-link";
import { AuthGuard } from "@/components/auth-guard";
import { WellbeingProvider, useWellbeing } from "@/context/wellbeing-context";
import { getNotificationCount, getHasUnreadMessages } from "@/lib/posts";
import { cn } from "@/lib/utils";

function AppHeader() {
  const { settings } = useWellbeing();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (settings.silentMode) return;

    const poll = () => {
      getNotificationCount()
        .then(({ count }) => setUnreadCount(count))
        .catch(() => {});
    };

    poll();
    const interval = setInterval(poll, 60_000);
    return () => clearInterval(interval);
  }, [settings.silentMode]);

  const showBellBadge = !settings.silentMode && !settings.reducedNotifications && unreadCount > 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/feed" className="text-lg font-medium text-foreground">
          entrelinhas
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Link>
          <Link
            href="/notifications"
            className={cn(
              "relative p-2 rounded-full hover:bg-muted transition-colors",
              settings.silentMode
                ? "text-muted-foreground/40"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Bell className="h-5 w-5" />
            {showBellBadge && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            )}
            <span className="sr-only">Notificações</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function MessagesNavItem() {
  const { settings } = useWellbeing();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (settings.silentMode || settings.reducedNotifications) return;

    const poll = () => {
      getHasUnreadMessages()
        .then(({ hasUnread }) => setHasUnread(hasUnread))
        .catch(() => {});
    };

    poll();
    const interval = setInterval(poll, 60_000);
    return () => clearInterval(interval);
  }, [settings.silentMode, settings.reducedNotifications]);

  return (
    <div className="relative">
      <AppNavLink href="/messages" icon={<MessageSquare className="h-5 w-5" />} label="Mensagens" />
      {hasUnread && (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary pointer-events-none" />
      )}
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <WellbeingProvider>
        <div className="min-h-screen bg-background">
          <AppHeader />

          <main className="pt-20 pb-24">{children}</main>

          <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-around">
              <AppNavLink href="/feed" icon={<Home className="h-5 w-5" />} label="Início" />
              <AppNavLink href="/new" icon={<PenLine className="h-5 w-5" />} label="Escrever" />
              <MessagesNavItem />
              <AppNavLink href="/profile" icon={<User className="h-5 w-5" />} label="Perfil" />
              <AppNavLink href="/settings" icon={<Settings className="h-5 w-5" />} label="Ajustes" />
            </div>
          </nav>
        </div>
      </WellbeingProvider>
    </AuthGuard>
  );
}

export default AppLayout;
