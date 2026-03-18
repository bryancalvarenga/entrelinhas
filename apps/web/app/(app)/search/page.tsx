"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { searchPosts, searchProfiles } from "@/lib/posts";
import { Post, PublicProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

const THEMES = [
  "Reflexão",
  "Rotina",
  "Criatividade",
  "Emoções",
  "Silêncio",
  "Arte",
  "Memórias",
  "Crescimento",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "people" | "themes">(
    "posts",
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setPosts([]);
      setProfiles([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      Promise.all([searchPosts(query.trim()), searchProfiles(query.trim())])
        .then(([postsData, profilesData]) => {
          setPosts(postsData);
          setProfiles(profilesData);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao feed
        </Link>
        <h1 className="text-2xl font-light text-foreground mb-4">Buscar</h1>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar registros, pessoas ou temas..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border/50">
        <TabButton
          active={activeTab === "posts"}
          onClick={() => setActiveTab("posts")}
        >
          Registros
        </TabButton>
        <TabButton
          active={activeTab === "people"}
          onClick={() => setActiveTab("people")}
        >
          Pessoas
        </TabButton>
        <TabButton
          active={activeTab === "themes"}
          onClick={() => setActiveTab("themes")}
        >
          Temas
        </TabButton>
      </div>

      {/* Content */}
      {activeTab === "posts" && (
        <div>
          {!query.trim() ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Digite algo para buscar registros.
              </p>
            </div>
          ) : loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-card rounded-xl border border-border/50 animate-pulse"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhum registro encontrado para &ldquo;{query}&rdquo;.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "people" && (
        <div>
          {!query.trim() ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Digite algo para buscar pessoas.
              </p>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-card rounded-xl border border-border/50 animate-pulse"
                />
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhuma pessoa encontrada para &ldquo;{query}&rdquo;.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "themes" && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">Explore por tema</p>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme}
                className="px-4 py-2 bg-card border border-border/50 rounded-full text-foreground hover:border-primary/50 transition-colors"
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
        active
          ? "text-foreground border-primary"
          : "text-muted-foreground border-transparent hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ProfileCard({ profile }: { profile: PublicProfile }) {
  return (
    <Link
      href={`/profile/${profile.username}`}
      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-border transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <span className="text-base font-medium text-muted-foreground">
          {profile.avatarInitial}
        </span>
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{profile.name}</p>
        {profile.bio && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {profile.bio}
          </p>
        )}
      </div>
    </Link>
  );
}
