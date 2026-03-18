import Link from "next/link";
import {
  ArrowRight,
  Feather,
  Heart,
  Moon,
  Sparkles,
  BookOpen,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function fetchStats(): Promise<{ users: number; posts: number } | null> {
  try {
    const res = await fetch(`${API}/stats`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

interface RandomPost {
  id: string;
  content: string;
  intention: string;
  author: { name: string; username: string };
}

async function fetchRandomPost(): Promise<RandomPost | null> {
  try {
    const res = await fetch(`${API}/posts/random`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function LandingPage() {
  const [stats, randomPost] = await Promise.all([fetchStats(), fetchRandomPost()]);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-medium tracking-tight text-foreground"
          >
            entrelinhas
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#sobre"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="#diferenciais"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Diferenciais
            </Link>
            <Link
              href="#comunidade"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Comunidade
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Entrar
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Começar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
            Uma rede social diferente
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight text-foreground mb-8 text-balance">
            O espaço para quem prefere <span className="italic">sentir</span> do
            que <span className="italic">performar</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Entrelinhas é uma rede social calma, íntima e humana. Sem likes
            públicos, sem contadores de seguidores, sem feed infinito. Apenas
            você e suas palavras.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                Criar meu espaço
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#sobre">
              <Button
                variant="ghost"
                size="lg"
                className="text-muted-foreground"
              >
                Saiba mais
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Break */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-border/60" />
      </div>

      {/* About Section */}
      <section id="sobre" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Nossa filosofia
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 text-balance">
                Criado para reduzir a ansiedade digital
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                As redes sociais tradicionais foram desenhadas para maximizar
                engajamento, não bem-estar. Entrelinhas nasceu de uma pergunta:
                e se criássemos um espaço digital que nos fizesse sentir melhor,
                não pior?
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Aqui, você encontra um refúgio. Um lugar para registrar
                pensamentos, compartilhar reflexões e conectar-se genuinamente —
                sem a pressão de uma audiência julgando cada palavra.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border/50">
              {randomPost ? (
                <>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    {randomPost.intention}
                  </p>
                  <p className="text-lg text-foreground leading-relaxed line-clamp-5">
                    {randomPost.content}
                  </p>
                  <p className="mt-6 text-sm text-muted-foreground">
                    — {randomPost.author.name}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground italic">
                  Ainda não há registros.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section id="diferenciais" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              O que nos torna diferentes
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground text-balance">
              Desenhado com intenção
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <DifferentialCard
              icon={<Heart className="h-5 w-5" />}
              title="Sem métricas de popularidade"
              description="Nada de likes públicos ou contadores de seguidores. Sua expressão não é um concurso."
            />
            <DifferentialCard
              icon={<Moon className="h-5 w-5" />}
              title="Feed intencional"
              description="Sem scroll infinito ou algoritmos de vício. Você escolhe quando e quanto quer ver."
            />
            <DifferentialCard
              icon={<Feather className="h-5 w-5" />}
              title="Foco no texto"
              description="Um espaço para pensamentos, reflexões e pequenas cartas. Não é sobre imagens perfeitas."
            />
            <DifferentialCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Interações sutis"
              description="Em vez de curtidas, temos 'isso me tocou'. Respostas reflexivas ao invés de comentários rápidos."
            />
            <DifferentialCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Estética de diário"
              description="Visual calmo, elegante e respirável. Como um caderno contemporâneo no seu bolso."
            />
            <DifferentialCard
              icon={<Users className="h-5 w-5" />}
              title="Comunidade acolhedora"
              description="Um ambiente sem julgamentos, onde cada voz é respeitada e ouvida."
            />
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            Como funciona
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-16 text-balance">
            Um espaço pensado para você
          </h2>

          <div className="bg-card rounded-2xl border border-border/50 p-8 md:p-12">
            <div className="space-y-8">
              <div className="flex items-start gap-6 text-left">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm text-primary font-medium">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Escolha sua intenção
                  </h3>
                  <p className="text-muted-foreground">
                    Registrar um momento, compartilhar uma reflexão, desabafar
                    em silêncio ou apenas observar. Cada post começa com uma
                    intenção.
                  </p>
                </div>
              </div>

              <div className="h-px bg-border/60" />

              <div className="flex items-start gap-6 text-left">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm text-primary font-medium">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Escreva com calma
                  </h3>
                  <p className="text-muted-foreground">
                    Um editor limpo e sem distrações. Apenas você, suas palavras
                    e o tempo que precisar.
                  </p>
                </div>
              </div>

              <div className="h-px bg-border/60" />

              <div className="flex items-start gap-6 text-left">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm text-primary font-medium">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Conecte-se de verdade
                  </h3>
                  <p className="text-muted-foreground">
                    Leia textos que tocam, responda com reflexões. Aqui, as
                    conexões são profundas, não superficiais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="comunidade" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            Junte-se a nós
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 text-balance">
            Uma comunidade que valoriza presença
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Milhares de pessoas já encontraram seu espaço no Entrelinhas.
            Pessoas que buscam mais profundidade e menos ruído em suas conexões
            digitais.
          </p>

          {stats && (
            <div className="grid grid-cols-2 gap-8 max-w-xs mx-auto mb-12">
              <div>
                <p className="text-3xl font-light text-foreground">
                  {stats.users.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-muted-foreground">Membros</p>
              </div>
              <div>
                <p className="text-3xl font-light text-foreground">
                  {stats.posts.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-muted-foreground">Registros</p>
              </div>
            </div>
          )}

          <Link href="/onboarding">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            >
              Criar minha conta
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xl font-medium text-foreground mb-2">
                entrelinhas
              </p>
              <p className="text-sm text-muted-foreground">
                Uma rede social mais humana.
              </p>
            </div>
            <nav className="flex items-center gap-8">
              <Link
                href="#sobre"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sobre
              </Link>
              <Link
                href="/settings/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacidade
              </Link>
              <Link
                href="/settings/help"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ajuda
              </Link>
              <a
                href="mailto:oi@entrelinhas.app"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contato
              </a>
            </nav>
          </div>
          <div className="mt-12 pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Entrelinhas. Feito com calma.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DifferentialCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border/50 hover:border-border transition-colors">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
