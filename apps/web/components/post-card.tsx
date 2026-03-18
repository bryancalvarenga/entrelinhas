"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Bookmark, BookmarkCheck, HeartHandshake, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Post } from "@/lib/types";
import { touchPost, untouchPost, savePost, unsavePost, deletePost } from "@/lib/posts";
import { useAuth } from "@/context/auth-context";

interface PostCardProps {
  post: Post;
  showFullContent?: boolean;
  initialTouched?: boolean;
  initialSaved?: boolean;
  onDeleted?: (postId: string) => void;
}

const INTENTION_LABELS: Record<Post["intention"], string> = {
  registrar: "Registro",
  compartilhar: "Compartilhamento",
  desabafar: "Desabafo",
  refletir: "Reflexão",
};

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

export function PostCard({
  post,
  showFullContent = false,
  initialTouched,
  initialSaved,
  onDeleted,
}: PostCardProps) {
  const { profileId } = useAuth();
  const isOwner = !!profileId && post.author.id === profileId;

  const [isTouched, setIsTouched] = useState(
    initialTouched ?? post.touched ?? false
  );
  const [isSaved, setIsSaved] = useState(
    initialSaved ?? post.saved ?? false
  );
  const [touchLoading, setTouchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleTouch = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (touchLoading) return;
    const next = !isTouched;
    setIsTouched(next);
    setTouchLoading(true);
    try {
      if (next) await touchPost(post.id);
      else await untouchPost(post.id);
    } catch {
      setIsTouched(!next);
    } finally {
      setTouchLoading(false);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saveLoading) return;
    const next = !isSaved;
    setIsSaved(next);
    setSaveLoading(true);
    try {
      if (next) await savePost(post.id);
      else await unsavePost(post.id);
    } catch {
      setIsSaved(!next);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deleting) return;
    setDeleting(true);
    try {
      await deletePost(post.id);
      setDeleted(true);
      onDeleted?.(post.id);
    } catch {
      setDeleting(false);
    }
  };

  if (deleted) return null;

  const content =
    showFullContent || post.content.length <= 280
      ? post.content
      : post.content.slice(0, 280) + "...";

  return (
    <article className="bg-card rounded-xl border border-border/50 p-6 hover:border-border transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <Link
          href={`/profile/${post.author.username}`}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {post.author.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                {post.author.avatarInitial}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
              {post.author.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{INTENTION_LABELS[post.intention]}</span>
              <span>·</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>
        </Link>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 -mr-1"
            title="Excluir registro"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <Link href={`/post/${post.id}`}>
        <div className="mb-6">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
          {!showFullContent && post.content.length > 280 && (
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              continuar lendo
            </span>
          )}
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-6">
          <button
            onClick={handleTouch}
            disabled={touchLoading}
            className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              isTouched
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HeartHandshake
              className={cn("h-4 w-4", isTouched && "fill-current")}
            />
            <span className="hidden sm:inline">
              {isTouched ? "Me tocou" : "Isso me tocou"}
            </span>
          </button>

          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">
              {post._count.replies > 0
                ? `${post._count.replies} ${post._count.replies === 1 ? "resposta" : "respostas"}`
                : "Responder"}
            </span>
          </Link>
        </div>

        <button
          onClick={handleSave}
          disabled={saveLoading}
          className={cn(
            "flex items-center gap-2 text-sm transition-colors",
            isSaved
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {isSaved ? (
            <BookmarkCheck className="h-4 w-4 fill-current" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{isSaved ? "Salvo" : "Salvar"}</span>
        </button>
      </div>
    </article>
  );
}
