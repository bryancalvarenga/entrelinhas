"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, initialized } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redireciona em useEffect para evitar "update during render"
  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.replace("/feed");
    }
  }, [initialized, isAuthenticated, router]);

  // Aguarda inicialização; se autenticado, não renderiza o form
  if (!initialized || isAuthenticated) return null;

  const canSubmit = email.trim().length > 0 && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError("");

    try {
      const { onboardingDone } = await login(email.trim(), password);
      router.push(onboardingDone ? "/feed" : "/onboarding");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Não foi possível entrar.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <Link href="/" className="text-lg font-medium text-foreground">
          entrelinhas
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-light text-foreground mb-4">
                Bem-vindo de volta
              </h1>
              <p className="text-muted-foreground">
                Entre com seu e-mail e senha para continuar.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                autoComplete="email"
                autoFocus
                className="w-full px-4 py-4 text-lg bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                autoComplete="current-password"
                className="w-full px-4 py-4 text-lg bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
              />

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-4 text-base"
            >
              {loading ? "Entrando..." : "Entrar"}
              {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-border/50">
        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem uma conta?{" "}
          <Link
            href="/onboarding"
            className="text-foreground hover:underline underline-offset-4"
          >
            Criar meu espaço
          </Link>
        </p>
      </footer>
    </div>
  );
}
