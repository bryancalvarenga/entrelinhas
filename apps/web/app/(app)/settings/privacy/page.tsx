import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-light text-foreground">Privacidade</h1>
        <p className="mt-1 text-muted-foreground">
          O Entrelinhas foi construído para que você possa escrever com calma, sem sentir que está sendo observado.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            O que nunca é público
          </h2>
          <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
            <Item
              title="Toques"
              body="Quando você toca em um registro, só você sabe. O autor não recebe notificação e não há contador visível para ninguém — nem para você, nem para quem escreveu."
            />
            <Item
              title="Posts salvos"
              body='Sua coleção de "salvos" é completamente privada. Ninguém além de você tem acesso a ela.'
            />
            <Item
              title="Seu comportamento no app"
              body="O Entrelinhas não rastreia o que você lê, quanto tempo você passa em cada post nem como você navega. Sua presença aqui é só sua."
            />
            <Item
              title="Quem você segue e quem te segue"
              body="Não exibimos contagens de seguidores. Seguir alguém é um gesto pessoal, não uma métrica."
            />
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            O que é visível
          </h2>
          <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
            <Item
              title="Seu perfil"
              body="Nome, username, bio e interesses são públicos para qualquer pessoa no Entrelinhas. Você pode editar isso a qualquer momento no seu perfil."
            />
            <Item
              title="Seus registros publicados"
              body="Os textos que você publica aparecem no feed de quem te segue e podem ser vistos por qualquer usuário que acesse seu perfil."
            />
            <Item
              title="Suas respostas"
              body="Respostas que você deixa em registros de outras pessoas aparecem no contexto daquele post."
            />
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Como tratamos seus dados
          </h2>
          <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
            <Item
              title="Sem anúncios, sem venda de dados"
              body="Não monetizamos seus dados. Não existe publicidade no Entrelinhas. Suas informações não são compartilhadas com terceiros."
            />
            <Item
              title="Seus dados são seus"
              body="Você pode excluir sua conta quando quiser. Quando isso acontece, todos os seus registros, respostas, toques e informações de perfil são apagados permanentemente."
            />
            <Item
              title="Armazenamento seguro"
              body="Seus dados são armazenados com criptografia e acessados apenas quando necessário para o funcionamento do produto."
            />
          </div>
        </section>

        <p className="text-sm text-muted-foreground text-center pt-2">
          Dúvidas sobre privacidade?{" "}
          <a
            href="mailto:privacidade@entrelinhas.app"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Entre em contato
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function Item({ title, body }: { title: string; body: string }) {
  return (
    <div className="px-5 py-4">
      <p className="font-medium text-foreground mb-1">{title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
