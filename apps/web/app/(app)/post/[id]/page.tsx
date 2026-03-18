"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HeartHandshake,
  Bookmark,
  BookmarkCheck,
  Send,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getPost,
  getReplies,
  createReply,
  getTouchStatus,
  touchPost,
  untouchPost,
  getSaveStatus,
  savePost,
  unsavePost,
  deletePost,
  deleteReply,
} from "@/lib/posts";
import { Post, Reply } from "@/lib/types";
import { useAuth } from "@/context/auth-context";

const INTENTION_LABELS: Record<Post["intention"], string> = {
  registrar: "Registro",
  compartilhar: "Compartilhamento",
  desabafar: "Desabafo",
  refletir: "Reflexão",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "agora";
  if (diffInMinutes < 60) return `${diffInMinutes}min`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;

  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { profileId } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [isTouched, setIsTouched] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [touchLoading, setTouchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [deletingPost, setDeletingPost] = useState(false);

  useEffect(() => {
    Promise.all([
      getPost(id),
      getReplies(id),
      getTouchStatus(id),
      getSaveStatus(id),
    ])
      .then(([postData, repliesData, touchData, saveData]) => {
        setPost(postData);
        setReplies(repliesData);
        setIsTouched(touchData.touched);
        setIsSaved(saveData.saved);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("não encontrado") || msg.includes("404")) {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleTouch = async () => {
    if (touchLoading) return;
    const next = !isTouched;
    setIsTouched(next);
    setTouchLoading(true);
    try {
      if (next) {
        await touchPost(id);
      } else {
        await untouchPost(id);
      }
    } catch {
      setIsTouched(!next);
    } finally {
      setTouchLoading(false);
    }
  };

  const handleSave = async () => {
    if (saveLoading) return;
    const next = !isSaved;
    setIsSaved(next);
    setSaveLoading(true);
    try {
      if (next) {
        await savePost(id);
      } else {
        await unsavePost(id);
      }
    } catch {
      setIsSaved(!next);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (replyContent.trim().length < 5 || sendingReply) return;
    setSendingReply(true);
    setReplyError("");
    try {
      const newReply = await createReply(id, replyContent.trim());
      setReplies((prev) => [...prev, newReply]);
      setReplyContent("");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível enviar.";
      setReplyError(msg);
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeletePost = async () => {
    if (deletingPost) return;
    setDeletingPost(true);
    try {
      await deletePost(id);
      window.location.href = "/feed";
    } catch {
      setDeletingPost(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      await deleteReply(id, replyId);
      setReplies((prev) => prev.filter((r) => r.id !== replyId));
    } catch {
      // silently fail
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 animate-pulse">
        <div className="h-4 w-24 bg-muted rounded mb-8" />
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-28 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground mb-4">
          Publicação não encontrada.
        </p>
        <Link
          href="/feed"
          className="text-sm text-primary hover:underline underline-offset-4"
        >
          Voltar ao feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Back */}
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao feed
      </Link>

      {/* Post */}
      <article className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/profile/${post.author.username}`}>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {post.author.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-base font-medium text-muted-foreground">
                  {post.author.avatarInitial}
                </span>
              )}
            </div>
          </Link>
          <div>
            <Link
              href={`/profile/${post.author.username}`}
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              {post.author.name}
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{INTENTION_LABELS[post.intention]}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xl leading-relaxed text-foreground whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {formatDate(post.createdAt)}
        </p>

        {/* Actions — sem exibição de contagem de touch */}
        <div className="flex items-center justify-between py-4 border-y border-border/50">
          <div className="flex items-center gap-4">
            <button
              onClick={handleTouch}
              disabled={touchLoading}
              className={cn(
                "flex items-center gap-2 transition-colors",
                isTouched
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <HeartHandshake
                className={cn("h-5 w-5", isTouched && "fill-current")}
              />
              <span>{isTouched ? "Me tocou" : "Isso me tocou"}</span>
            </button>

            {profileId === post.author.id && (
              <button
                onClick={handleDeletePost}
                disabled={deletingPost}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
                title="Excluir registro"
              >
                <Trash2 className="h-4 w-4" />
                <span>{deletingPost ? "Excluindo..." : "Excluir"}</span>
              </button>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saveLoading}
            className={cn(
              "flex items-center gap-2 transition-colors",
              isSaved
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 fill-current" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
            <span>{isSaved ? "Salvo" : "Salvar"}</span>
          </button>
        </div>
      </article>

      {/* Reply input */}
      <div className="mb-8">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-muted-foreground">·</span>
          </div>
          <div className="flex-1">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Escreva uma resposta reflexiva..."
              className="w-full min-h-[100px] p-4 text-foreground bg-card border border-border/50 rounded-xl outline-none focus:ring-2 focus:ring-ring resize-none placeholder:text-muted-foreground/60"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-muted-foreground">
                {replyContent.length} caracteres
              </p>
              <div className="flex items-center gap-3">
                {replyError && (
                  <p className="text-sm text-destructive">{replyError}</p>
                )}
                <Button
                  onClick={handleSubmitReply}
                  disabled={replyContent.trim().length < 5 || sendingReply}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendingReply ? "Enviando..." : "Responder"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div>
        <h2 className="text-lg font-medium text-foreground mb-6">
          {replies.length > 0
            ? `${replies.length} ${replies.length === 1 ? "resposta" : "respostas"}`
            : "Respostas"}
        </h2>

        {replies.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border/50">
            <p className="text-muted-foreground mb-2">
              Nenhuma resposta ainda.
            </p>
            <p className="text-sm text-muted-foreground">
              Seja o primeiro a compartilhar seus pensamentos.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {replies.map((reply) => (
              <div key={reply.id} className="flex items-start gap-3">
                <Link href={`/profile/${reply.author.username}`}>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {reply.author.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={reply.author.avatarUrl}
                        alt={reply.author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        {reply.author.avatarInitial}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/profile/${reply.author.username}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {reply.author.name}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        · {formatRelativeTime(reply.createdAt)}
                      </span>
                    </div>
                    {profileId === reply.author.id && (
                      <button
                        onClick={() => handleDeleteReply(reply.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Excluir resposta"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {reply.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
