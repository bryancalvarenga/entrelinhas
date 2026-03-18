"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, UserPlus, MessageCircle } from "lucide-react";
import { AppNotification } from "@/lib/types";
import { getNotifications, markAllNotificationsRead } from "@/lib/posts";
import { useWellbeing } from "@/context/wellbeing-context";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min`;
  if (h < 24) return `${h}h`;
  if (d < 7) return `${d}d`;
  return new Date(dateString).toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

export default function NotificationsPage() {
  const { settings } = useWellbeing();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    getNotifications()
      .then((all) => {
        // reducedNotifications: mostra apenas new_follower (menos ruído)
        const filtered = settings.reducedNotifications
          ? all.filter((n) => n.type === "new_follower")
          : all;
        setNotifications(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [settings.reducedNotifications]);

  const handleMarkAll = async () => {
    if (marked) return;
    await markAllNotificationsRead().catch(() => {});
    setMarked(true);
  };

  const label = (n: AppNotification) => {
    if (n.type === "new_follower") return "Alguém começou a te seguir.";
    if (n.type === "new_reply") return "Alguém respondeu a um dos seus registros.";
    return "";
  };

  const icon = (n: AppNotification) =>
    n.type === "new_follower" ? (
      <UserPlus className="h-4 w-4" />
    ) : (
      <MessageCircle className="h-4 w-4" />
    );

  const href = (n: AppNotification) =>
    n.type === "new_reply" && n.referenceId ? `/post/${n.referenceId}` : null;

  if (settings.silentMode) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-2xl font-light text-foreground">Notificações</h1>
        </div>
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Modo silencioso ativado. Notificações em pausa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-2xl font-light text-foreground">Notificações</h1>
          {settings.reducedNotifications && (
            <p className="text-xs text-muted-foreground mt-1">
              Notificações reduzidas ativas — mostrando apenas novos seguidores.
            </p>
          )}
        </div>
        {notifications.length > 0 && !marked && (
          <button
            onClick={handleMarkAll}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-8"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border/50 p-4 animate-pulse">
              <div className="h-3 w-3/4 bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="text-center py-16">
          <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma notificação por enquanto.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Quando alguém responder ou começar a te seguir, você verá aqui.
          </p>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
          {notifications.map((n) => {
            const link = href(n);
            const content = (
              <div
                className={cn(
                  "flex items-start gap-3 p-4",
                  link && "hover:bg-muted/40 transition-colors",
                )}
              >
                <span className="text-muted-foreground mt-0.5">{icon(n)}</span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{label(n)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatRelativeTime(n.createdAt)}
                  </p>
                </div>
              </div>
            );

            return link ? (
              <Link key={n.id} href={link}>
                {content}
              </Link>
            ) : (
              <div key={n.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
