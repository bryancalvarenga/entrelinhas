"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Send, BookOpen, Share2, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createPost, PostIntention } from "@/lib/posts";

const INTENTIONS: {
  id: PostIntention;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: "registrar",
    label: "Registrar",
    description: "Documentar um momento ou pensamento",
    icon: BookOpen,
  },
  {
    id: "compartilhar",
    label: "Compartilhar",
    description: "Dividir algo com a comunidade",
    icon: Share2,
  },
  {
    id: "desabafar",
    label: "Desabafar",
    description: "Expressar sentimentos livremente",
    icon: Heart,
  },
  {
    id: "refletir",
    label: "Refletir",
    description: "Pensar em voz alta sobre algo",
    icon: Sparkles,
  },
];

export default function NewPostPage() {
  const router = useRouter();
  const [intention, setIntention] = useState<PostIntention | null>(null);
  const [content, setContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  const canPublish = intention && content.trim().length >= 10 && !publishing;

  const handlePublish = async () => {
    if (!canPublish || !intention) return;

    setPublishing(true);
    setError("");

    try {
      await createPost({ content: content.trim(), intention });
      router.push("/feed");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível publicar.";
      setError(msg);
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/feed"
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Fechar</span>
          </Link>
          <span className="text-sm text-muted-foreground">Novo registro</span>
          <Button
            onClick={handlePublish}
            disabled={!canPublish}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {publishing ? (
              "Publicando..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Publicar
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          {!intention ? (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-light text-foreground mb-3">
                  Qual é a sua intenção?
                </h1>
                <p className="text-muted-foreground">
                  Escolha o tipo de registro que deseja criar.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {INTENTIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setIntention(item.id)}
                      className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-medium text-foreground mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIntention(null)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mudar intenção
                </button>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-primary capitalize">
                  {INTENTIONS.find((i) => i.id === intention)?.label}
                </span>
              </div>

              <div className="min-h-[400px]">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva o que está no seu coração..."
                  className="w-full h-[400px] text-lg leading-relaxed bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground/60"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  {content.length} caracteres
                </p>
                <div className="flex items-center gap-4">
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  {content.length < 10 && content.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Mínimo de 10 caracteres
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
