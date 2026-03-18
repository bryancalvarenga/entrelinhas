"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getFeed } from "@/lib/posts";
import { Post } from "@/lib/types";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFeed()
      .then(setPosts)
      .catch(() => setError("Não foi possível carregar o feed."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8 text-center">
        <p className="text-sm text-muted-foreground">
          Bem-vindo de volta. Aqui estão alguns pensamentos para você.
        </p>
      </div>

      {loading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border/50 p-6 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-4/5 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">{error}</p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">
            Seu feed está vazio por enquanto.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Siga algumas pessoas ou escreva seu primeiro registro.
          </p>
          <Link
            href="/new"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
          >
            <PenLine className="h-4 w-4" />
            Escrever algo
          </Link>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-12 py-12 text-center border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-2">
              Você chegou ao fim do seu feed de hoje.
            </p>
            <p className="text-xs text-muted-foreground">
              Volte mais tarde para novas reflexões.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
