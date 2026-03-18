"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, BookMarked, Edit3, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { getMyProfile, getMyPosts, getSavedPosts, updateMyProfile } from "@/lib/posts";
import { MyProfile, Post, PublicProfile } from "@/lib/types";

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

function Avatar({
  avatarUrl,
  avatarInitial,
  size = "lg",
}: {
  avatarUrl?: string | null;
  avatarInitial: string;
  size?: "sm" | "lg";
}) {
  const cls =
    size === "lg"
      ? "w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 overflow-hidden"
      : "w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden";

  return (
    <div className={cls}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className={
            size === "lg"
              ? "text-2xl font-medium text-muted-foreground"
              : "text-sm font-medium text-muted-foreground"
          }
        >
          {avatarInitial}
        </span>
      )}
    </div>
  );
}

function EditProfileModal({
  profile,
  onSave,
  onClose,
}: {
  profile: MyProfile;
  onSave: (updated: PublicProfile) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (name.trim().length < 2) {
      setError("Nome precisa ter ao menos 2 caracteres.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await updateMyProfile({
        name: name.trim(),
        bio: bio.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
      });
      onSave(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div className="bg-card border border-border/50 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-foreground">Editar perfil</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Conte um pouco sobre você..."
              className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-ring resize-none placeholder:text-muted-foreground/60"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {bio.length}/200
            </p>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              URL da foto de perfil
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Cole a URL de uma imagem pública
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={saving || name.trim().length < 2}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Check className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [saved, setSaved] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    Promise.all([getMyProfile(), getMyPosts(), getSavedPosts()])
      .then(([profileData, postsData, savedData]) => {
        setProfile(profileData);
        setPosts(postsData);
        setSaved(savedData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 animate-pulse">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4" />
          <div className="h-6 w-32 bg-muted rounded mx-auto mb-3" />
          <div className="h-4 w-64 bg-muted rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-muted-foreground">
          Não foi possível carregar o perfil.
        </p>
      </div>
    );
  }

  return (
    <>
      {editOpen && (
        <EditProfileModal
          profile={profile}
          onSave={(updated) => {
            // Preserva onboardingDone do perfil existente (PATCH retorna PublicProfile)
            setProfile((prev) => prev ? { ...prev, ...updated } : prev);
            setEditOpen(false);
          }}
          onClose={() => setEditOpen(false)}
        />
      )}

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <Avatar
            avatarUrl={profile.avatarUrl}
            avatarInitial={profile.avatarInitial}
            size="lg"
          />
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
            <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
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

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setEditOpen(true)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Editar perfil
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats — apenas métricas reais e privadas */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="text-center py-4 bg-card rounded-xl border border-border/50">
            <p className="text-2xl font-light text-foreground">{posts.length}</p>
            <p className="text-sm text-muted-foreground">Registros</p>
          </div>
          <div className="text-center py-4 bg-card rounded-xl border border-border/50">
            <p className="text-2xl font-light text-foreground">{saved.length}</p>
            <p className="text-sm text-muted-foreground">Salvos</p>
          </div>
        </div>

        {/* Recent Posts */}
        <section className="mb-10">
          <h2 className="text-lg font-medium text-foreground mb-6">
            Seus registros
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border/50">
              <p className="text-muted-foreground mb-2">Nenhum registro ainda.</p>
              <Link
                href="/new"
                className="text-sm text-primary hover:underline underline-offset-4"
              >
                Comece a escrever
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* Saved Posts */}
        <section>
          <h2 className="text-lg font-medium text-foreground flex items-center gap-2 mb-6">
            <BookMarked className="h-4 w-4" />
            Coleção salva
          </h2>

          {saved.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border/50">
              <p className="text-muted-foreground mb-2">Nenhum item salvo.</p>
              <p className="text-sm text-muted-foreground">
                Registros que te tocam aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {saved.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} initialSaved />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
