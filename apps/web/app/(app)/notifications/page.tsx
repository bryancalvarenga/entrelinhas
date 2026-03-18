"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, MessageCircle } from "lucide-react";
import { AppNotification } from "@/lib/types";
import { getNotifications, markAllNotificationsRead } from "@/lib/posts";
import { useWellbeing } from "@/context/wellbeing-context";

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
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAll = async () => {
    if (marked) return;
    await markAllNotificationsRead().catch(() => {});
    setMarked(true);
  };

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
            Quando alguém responder a um dos seus registros, você verá aqui.
          </p>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
          {notifications.map((n) => {
            const link = n.referenceId ? `/post/${n.referenceId}` : null;
            const content = (
              <div className="flex items-start gap-3 p-4 hover:bg-muted/40 transition-colors">
                <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Alguém respondeu a um dos seus registros.
                  </p>
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
