"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getConversation,
  sendMessage,
  editMessage,
  deleteMessage,
} from "@/lib/posts";
import { ConversationDetail, Message } from "@/lib/types";
import { useAuth } from "@/context/auth-context";

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
  });
}

function formatUnlocksAt(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffH = Math.round((date.getTime() - now.getTime()) / 3_600_000);
  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffH <= 1) return `em menos de uma hora (às ${time})`;
  return `às ${time} (em ~${diffH}h)`;
}

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { profileId } = useAuth();

  const [data, setData] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const load = () => {
    getConversation(id)
      .then((d) => {
        setData(d);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSend = async () => {
    if (!content.trim() || sending) return;
    setSending(true);
    setSendError("");
    try {
      await sendMessage(id, content.trim());
      setContent("");
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Não foi possível enviar.";
      setSendError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleEdit = async (msgId: string) => {
    if (!editContent.trim()) return;
    try {
      await editMessage(id, msgId, editContent.trim());
      setEditing(null);
      setEditContent("");
      load();
    } catch {
      // silently fail
    }
  };

  const handleDelete = async (msgId: string) => {
    try {
      await deleteMessage(id, msgId);
      setData((prev) =>
        prev
          ? { ...prev, messages: prev.messages.filter((m) => m.id !== msgId) }
          : prev,
      );
    } catch {
      // silently fail
    }
  };

  const startEdit = (msg: Message) => {
    setEditing(msg.id);
    setEditContent(msg.content);
  };

  // Group messages by day
  const groupedMessages = (() => {
    if (!data) return [];
    const groups: { date: string; messages: Message[] }[] = [];
    for (const msg of data.messages) {
      const day = new Date(msg.sentAt).toDateString();
      const last = groups[groups.length - 1];
      if (last && last.date === day) {
        last.messages.push(msg);
      } else {
        groups.push({ date: day, messages: [msg] });
      }
    }
    return groups;
  })();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground mb-4">Conversa não encontrada.</p>
        <Link href="/messages" className="text-sm text-primary hover:underline underline-offset-4">
          Voltar
        </Link>
      </div>
    );
  }

  const other = data.otherProfile;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col min-h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/messages"
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Voltar</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center overflow-hidden">
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
          {other ? (
            <Link
              href={`/profile/${other.username}`}
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              {other.name}
            </Link>
          ) : (
            <span className="font-medium text-foreground">Conversa</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-6 mb-8">
        {data.messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma mensagem ainda.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Comece a conversa com uma mensagem.
            </p>
          </div>
        )}

        {groupedMessages.map((group) => (
          <div key={group.date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-xs text-muted-foreground">
                {formatDate(group.messages[0].sentAt)}
              </span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            <div className="space-y-3">
              {group.messages.map((msg) => {
                const isMine = msg.senderId === profileId;
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-2",
                      isMine ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {/* Avatar — other person only */}
                    {!isMine && (
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden mb-0.5">
                        {other?.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={other.avatarUrl}
                            alt={other.name ?? ""}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground">
                            {other?.avatarInitial ?? "?"}
                          </span>
                        )}
                      </div>
                    )}

                    <div className={cn("group max-w-[75%]", isMine ? "items-end" : "items-start", "flex flex-col")}>
                      {editing === msg.id ? (
                        <div className="flex flex-col gap-2 w-full">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-3 text-sm bg-card border border-border/50 rounded-xl outline-none focus:ring-2 focus:ring-ring resize-none"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => { setEditing(null); setEditContent(""); }}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(msg.id)}
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                            isMine
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-card border border-border/50 text-foreground rounded-bl-sm",
                          )}
                        >
                          {msg.content}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(msg.sentAt)}
                          {msg.editedAt && " · editada"}
                        </span>

                        {isMine && editing !== msg.id && (
                          <div className="hidden group-hover:flex items-center gap-1">
                            <button
                              onClick={() => startEdit(msg)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Editar"
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(msg.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              title="Apagar"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Composer or blocked state */}
      {data.canSend ? (
        <div className="bg-card border border-border/50 rounded-2xl p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Escreva uma mensagem..."
            className="w-full bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed min-h-[60px]"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            {sendError ? (
              <p className="text-sm text-destructive">{sendError}</p>
            ) : (
              <span />
            )}
            <Button
              onClick={handleSend}
              disabled={!content.trim() || sending}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-2xl p-5 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Você poderá responder{" "}
            {data.unlocksAt ? formatUnlocksAt(data.unlocksAt) : "em breve"}.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            A espera faz parte da conversa.
          </p>
        </div>
      )}
    </div>
  );
}
