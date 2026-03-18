"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { ConversationSummary } from "@/lib/types";
import { getConversations } from "@/lib/posts";

function formatRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min`;
  if (h < 24) return `${h}h`;
  if (d < 7) return `${d}d`;
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-foreground">Mensagens</h1>
        <p className="text-muted-foreground mt-1">
          Conversas privadas, sem pressa.
        </p>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border/50 p-4 animate-pulse flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-muted rounded" />
                <div className="h-3 w-48 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <div className="text-center py-20">
          <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Nenhuma conversa ainda.</p>
          <p className="text-sm text-muted-foreground">
            Você pode iniciar uma conversa a partir do perfil de outro usuário.
          </p>
        </div>
      )}

      {!loading && conversations.length > 0 && (
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
          {conversations.map((c) => {
            const other = c.otherProfile;
            const last = c.lastMessage;
            return (
              <Link
                key={c.id}
                href={`/messages/${c.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {other?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={other.avatarUrl}
                      alt={other.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      {other?.avatarInitial ?? "?"}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-medium text-foreground truncate ${c.unread ? "font-semibold" : ""}`}>
                      {other?.name ?? "Usuário"}
                    </p>
                    {last && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatRelativeTime(last.sentAt)}
                      </span>
                    )}
                  </div>
                  {last && (
                    <p className="text-sm text-muted-foreground truncate">
                      {last.content}
                    </p>
                  )}
                </div>

                {c.unread && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
