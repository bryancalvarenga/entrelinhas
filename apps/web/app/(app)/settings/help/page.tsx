import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const faqs = [
  {
    q: 'O que é "Isso me tocou"?',
    a: 'É uma forma silenciosa de se conectar com um registro. Quando algo que você lê ressoa com você, pode tocar. O autor não recebe notificação e não há número visível. É apenas uma presença — sem pressão, sem exibição.',
  },
  {
    q: "Por que não vejo likes ou contagem de reações?",
    a: "Porque o Entrelinhas foi feito para que as pessoas escrevam com honestidade, sem ficar calculando engajamento. Popularidade não diz nada sobre o valor de um texto. Aqui, cada registro existe por conta própria.",
  },
  {
    q: "Como funciona o feed?",
    a: "Você vê registros de quem você segue, em ordem cronológica. Não há algoritmo tentando te prender — o feed tem um limite diário para que o consumo seja consciente. Quando você chegar ao fim, é um convite para pausar.",
  },
  {
    q: "Posso editar ou excluir meus posts?",
    a: "Você pode excluir seus registros a qualquer momento, acessando o post e usando a opção de remover. No momento, não há edição após a publicação — escreva com calma antes de compartilhar.",
  },
  {
    q: "Como salvo um post para ler depois?",
    a: "Em qualquer registro, toque no ícone de marcador. O post vai para sua coleção privada de salvos, acessível só por você. Ninguém vê o que você salvou.",
  },
  {
    q: "O que acontece se eu excluir minha conta?",
    a: "Todos os seus dados são removidos permanentemente: registros, respostas, toques, perfil. Não há como desfazer. Se precisar de uma pausa, você pode simplesmente parar de usar — sua conta continuará esperando por você.",
  },
  {
    q: "Como funciona seguir alguém?",
    a: "Seguir alguém é um gesto pessoal. Não exibimos contagens de seguidores para ninguém — nem no seu perfil, nem no de outras pessoas. O foco é na conexão, não no número.",
  },
  {
    q: "Minhas atividades são visíveis para outros?",
    a: "Seus registros publicados e respostas são visíveis. Toques, posts salvos e o que você lê são completamente privados. Veja mais detalhes na página de Privacidade.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Configurações
        </Link>
        <h1 className="text-2xl font-light text-foreground">Ajuda</h1>
        <p className="mt-1 text-muted-foreground">
          Perguntas frequentes sobre como o Entrelinhas funciona.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
        {faqs.map(({ q, a }) => (
          <div key={q} className="px-5 py-4">
            <p className="font-medium text-foreground mb-1">{q}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground text-center">
        Não encontrou o que procurava?{" "}
        <a
          href="mailto:oi@entrelinhas.app"
          className="underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Fala com a gente
        </a>
        .
      </p>
    </div>
  );
}
