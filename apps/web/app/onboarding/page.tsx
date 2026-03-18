"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";

const INTERESTS = [
  {
    id: "reflexao",
    label: "Reflexão",
    description: "Pensar sobre a vida e seus caminhos",
  },
  {
    id: "rotina",
    label: "Rotina",
    description: "Registrar o dia a dia com intenção",
  },
  {
    id: "criatividade",
    label: "Criatividade",
    description: "Explorar ideias e expressões artísticas",
  },
  {
    id: "emocoes",
    label: "Emoções",
    description: "Processar sentimentos e estados de espírito",
  },
  {
    id: "silencio",
    label: "Silêncio",
    description: "Encontrar paz e momentos de pausa",
  },
  {
    id: "arte",
    label: "Arte",
    description: "Apreciar e discutir manifestações artísticas",
  },
  {
    id: "memorias",
    label: "Memórias",
    description: "Guardar momentos especiais",
  },
  {
    id: "crescimento",
    label: "Crescimento",
    description: "Jornada de desenvolvimento pessoal",
  },
];

const INTENTIONS = [
  {
    id: "registrar",
    label: "Registrar",
    description: "Documentar momentos e pensamentos do dia",
  },
  {
    id: "compartilhar",
    label: "Compartilhar",
    description: "Dividir reflexões com outros",
  },
  {
    id: "observar",
    label: "Observar",
    description: "Ler e absorver textos de outros",
  },
  {
    id: "desabafar",
    label: "Desabafar",
    description: "Expressar sentimentos livremente",
  },
  {
    id: "conectar",
    label: "Conectar",
    description: "Criar laços genuínos com pessoas",
  },
];

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, register } = useAuth();

  const [step, setStep] = useState(1);

  // Step 1 — conta
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [accountError, setAccountError] = useState("");

  // Step 2 — perfil
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  // Step 3 — interesses
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Step 4 — intenções
  const [selectedIntentions, setSelectedIntentions] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Usuário já autenticado visitando /onboarding:
  // verifica se onboarding já foi concluído → redireciona para /feed
  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get<{ onboardingDone: boolean }>("/profiles/me")
      .then(({ onboardingDone }) => {
        if (onboardingDone) router.replace("/feed");
        else setStep(2); // já tem conta, começa no perfil
      })
      .catch(() => {});
  }, [isAuthenticated, router]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleIntention = (id: string) => {
    setSelectedIntentions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    if (step === 1)
      return (
        email.trim().length > 0 &&
        password.length >= 8 &&
        password === passwordConfirm
      );
    if (step === 2)
      return (
        name.trim().length >= 2 &&
        username.trim().length >= 3 &&
        /^[a-z0-9_]+$/.test(username)
      );
    if (step === 3) return selectedInterests.length >= 1;
    if (step === 4) return selectedIntentions.length >= 1;
    return false;
  };

  const handleNext = async () => {
    if (step === 1) {
      setAccountError("");
      setSubmitting(true);
      try {
        await register(email.trim(), password);
        setStep(2);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Não foi possível criar a conta.";
        setAccountError(msg);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    // Step 4 — enviar onboarding
    setSubmitting(true);
    setSubmitError("");
    try {
      await api.post("/onboarding", {
        name: name.trim(),
        username: username.trim(),
        interests: selectedInterests,
        intentions: selectedIntentions,
      });
      router.push("/feed");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível concluir o cadastro.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const passwordMismatch =
    passwordConfirm.length > 0 && password !== passwordConfirm;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <Link href="/" className="text-lg font-medium text-foreground">
          entrelinhas
        </Link>
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                i + 1 <= step ? "bg-primary" : "bg-border"
              )}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Step 1 — Criar conta */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Passo 1 de {TOTAL_STEPS}
                </p>
                <h1 className="text-3xl font-light text-foreground mb-4">
                  Crie seu espaço
                </h1>
                <p className="text-muted-foreground">
                  Um lugar só seu, sem ruído e sem pressão.
                </p>
              </div>

              <div className="space-y-3">
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
                  placeholder="Senha (mínimo 8 caracteres)"
                  autoComplete="new-password"
                  className="w-full px-4 py-4 text-lg bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
                />
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Confirme a senha"
                  autoComplete="new-password"
                  className={cn(
                    "w-full px-4 py-4 text-lg bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground",
                    passwordMismatch ? "border-destructive" : "border-border"
                  )}
                />
                {passwordMismatch && (
                  <p className="text-sm text-destructive">
                    As senhas não coincidem.
                  </p>
                )}
                {accountError && (
                  <p className="text-sm text-destructive text-center">
                    {accountError}
                  </p>
                )}
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="text-foreground hover:underline underline-offset-4"
                >
                  Entrar
                </Link>
              </p>
            </div>
          )}

          {/* Step 2 — Nome e username */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Passo 2 de {TOTAL_STEPS}
                </p>
                <h1 className="text-3xl font-light text-foreground mb-4">
                  Como você quer ser chamado?
                </h1>
                <p className="text-muted-foreground">
                  Escolha o nome e o username que vão te representar aqui.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  autoFocus
                  className="w-full px-4 py-4 text-lg bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
                />
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                    }
                    placeholder="username"
                    className="w-full pl-9 pr-4 py-4 text-lg bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Apenas letras minúsculas, números e _.
                </p>
              </div>
            </div>
          )}

          {/* Step 3 — Interesses */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Passo 3 de {TOTAL_STEPS}
                </p>
                <h1 className="text-3xl font-light text-foreground mb-4">
                  O que te interessa?
                </h1>
                <p className="text-muted-foreground">
                  Escolha os temas que mais ressoam com você.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      selectedInterests.includes(interest.id)
                        ? "bg-primary/10 border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">
                          {interest.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {interest.description}
                        </p>
                      </div>
                      {selectedInterests.includes(interest.id) && (
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Intenções */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Passo 4 de {TOTAL_STEPS}
                </p>
                <h1 className="text-3xl font-light text-foreground mb-4">
                  Como pretende usar o Entrelinhas?
                </h1>
                <p className="text-muted-foreground">
                  Selecione suas intenções principais.
                </p>
              </div>

              <div className="space-y-3">
                {INTENTIONS.map((intention) => (
                  <button
                    key={intention.id}
                    onClick={() => toggleIntention(intention.id)}
                    className={cn(
                      "w-full p-5 rounded-xl border text-left transition-all",
                      selectedIntentions.includes(intention.id)
                        ? "bg-primary/10 border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {intention.label}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {intention.description}
                        </p>
                      </div>
                      {selectedIntentions.includes(intention.id) && (
                        <Check className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
                {submitError && (
                  <p className="text-sm text-destructive text-center">
                    {submitError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-border/50">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1 || submitting}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || submitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {submitting
              ? "Aguarde..."
              : step === TOTAL_STEPS
              ? "Entrar no Entrelinhas"
              : "Continuar"}
            {!submitting && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </footer>
    </div>
  );
}
