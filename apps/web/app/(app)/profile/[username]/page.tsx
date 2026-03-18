"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { use } from "react";
import { PostCard } from "@/components/post-card";
import { getPublicProfile, getProfilePosts } from "@/lib/posts";
import { PublicProfile, Post } from "@/lib/types";

const INTEREST_LABELS: Record<string, string> = {
  reflexao: "Reflexão",
  rotina: "Rotina",
  criatividade: "Criatividade",
  emocoes: "Emoções",
  silencio: "Silêncio",
  arte: "Arte",
  memorias: "Memórias",
  crescimento: "Crescimento",
};

function formatJoinDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([getPublicProfile(username), getProfilePosts(username)])
      .then(([profileData, postsData]) => {
        setProfile(profileData);
        setPosts(postsData);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("não encontrado") || msg.includes("404")) {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 animate-pulse">
        <div className="h-4 w-24 bg-muted rounded mb-8" />
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4" />
          <div className="h-6 w-32 bg-muted rounded mx-auto mb-3" />
          <div className="h-4 w-48 bg-muted rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground mb-4">Usuário não encontrado.</p>
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
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao feed
      </Link>

      {/* Profile Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 overflow-hidden">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-medium text-muted-foreground">
              {profile.avatarInitial}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-light text-foreground mb-2">
          {profile.name}
        </h1>
        {profile.bio && (
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-4">
            {profile.bio}
          </p>
        )}

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
            {profile.interests.map(({ interest }) => (
              <span
                key={interest}
                className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full"
              >
                {INTEREST_LABELS[interest] ?? interest}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Membro desde {formatJoinDate(profile.joinedAt)}
        </p>
      </div>

      {/* Posts */}
      <section>
        <h2 className="text-lg font-medium text-foreground mb-6">
          {posts.length > 0
            ? `${posts.length} ${posts.length === 1 ? "registro" : "registros"}`
            : "Registros"}
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border/50">
            <p className="text-muted-foreground">
              {profile.name} ainda não publicou nenhum registro.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
