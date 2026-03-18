// Mock data usado apenas pela página de busca enquanto o backend não tem endpoint de search.
// Os campos aqui respeitam os tipos reais da API (Post, User).

import { Post } from "./types";

export const mockUsers = [
  {
    id: "1",
    name: "Marina",
    username: "marina",
    bio: "Encontrando poesia no cotidiano. Apaixonada por amanheceres e palavras que acalmam.",
    interests: ["reflexao", "silencio", "arte"],
    joinedAt: "2024-01-15",
    avatarInitial: "M",
  },
  {
    id: "2",
    name: "Gabriel",
    username: "gabriel",
    bio: "Escrevendo para entender. Designer de profissão, filósofo de coração.",
    interests: ["criatividade", "crescimento", "emocoes"],
    joinedAt: "2024-02-20",
    avatarInitial: "G",
  },
  {
    id: "3",
    name: "Luna",
    username: "luna",
    bio: "Colecionadora de momentos pequenos e significativos.",
    interests: ["memorias", "rotina", "silencio"],
    joinedAt: "2024-03-10",
    avatarInitial: "L",
  },
  {
    id: "4",
    name: "Pedro",
    username: "pedro",
    bio: "Músico. Pai. Buscando equilíbrio entre o ruído e o silêncio.",
    interests: ["arte", "emocoes", "reflexao"],
    joinedAt: "2024-01-05",
    avatarInitial: "P",
  },
  {
    id: "5",
    name: "Clara",
    username: "clara",
    bio: "Terapeuta. Aqui para ouvir e ser ouvida, sem pressa.",
    interests: ["emocoes", "crescimento", "silencio"],
    joinedAt: "2024-04-01",
    avatarInitial: "C",
  },
];

export const mockPosts: Post[] = [
  {
    id: "1",
    author: { id: "1", name: "Marina", username: "marina", avatarInitial: "M" },
    content:
      "Hoje acordei antes do sol. Fiquei na varanda ouvindo os pássaros enquanto o céu mudava de cor. Não fiz nada produtivo, apenas existir. E percebi que existir já é muito.\n\nPrecisamos nos lembrar mais disso.",
    intention: "refletir",
    createdAt: "2024-12-15T06:30:00Z",
    _count: { replies: 3 },
  },
  {
    id: "2",
    author: { id: "2", name: "Gabriel", username: "gabriel", avatarInitial: "G" },
    content:
      "Passei o dia redesenhando um projeto que já estava 'pronto'. Às vezes a perfeição é inimiga do bom, mas às vezes... o bom ainda pode ser melhor.\n\nA linha é tão fina entre perfeccionismo e excelência.",
    intention: "registrar",
    createdAt: "2024-12-14T18:45:00Z",
    _count: { replies: 5 },
  },
  {
    id: "3",
    author: { id: "3", name: "Luna", username: "luna", avatarInitial: "L" },
    content:
      "Encontrei uma foto antiga da minha avó hoje. Ela tinha a minha idade atual. Olhei nos olhos dela e vi tantas histórias que nunca ouvi. Tantas perguntas que nunca fiz.\n\nO tempo é cruel quando desperdiçamos perguntas.",
    intention: "desabafar",
    createdAt: "2024-12-14T14:20:00Z",
    _count: { replies: 8 },
  },
  {
    id: "4",
    author: { id: "4", name: "Pedro", username: "pedro", avatarInitial: "P" },
    content:
      "Meu filho de 4 anos me perguntou por que a música faz as pessoas chorarem se é bonita. Tentei explicar, mas percebi que não sei. Talvez a beleza e a tristeza morem no mesmo lugar dentro da gente.",
    intention: "compartilhar",
    createdAt: "2024-12-13T20:00:00Z",
    _count: { replies: 12 },
  },
  {
    id: "5",
    author: { id: "5", name: "Clara", username: "clara", avatarInitial: "C" },
    content:
      "Às vezes o melhor que podemos fazer por alguém é simplesmente estar ali. Sem conselhos, sem soluções, sem tentativas de consertar. Apenas presença.\n\nPresença é um ato de amor subestimado.",
    intention: "refletir",
    createdAt: "2024-12-13T10:15:00Z",
    _count: { replies: 15 },
  },
  {
    id: "6",
    author: { id: "1", name: "Marina", username: "marina", avatarInitial: "M" },
    content:
      "Li três páginas de um livro hoje. Só três. Mas foram três páginas com atenção total, sem celular, sem pressa. E valeram mais que os capítulos que costumo devorar distraidamente.",
    intention: "registrar",
    createdAt: "2024-12-12T21:30:00Z",
    _count: { replies: 4 },
  },
];
