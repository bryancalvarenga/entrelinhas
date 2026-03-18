// Tipos que refletem as respostas reais da API

export interface ApiAuthor {
  id: string;
  name: string;
  username: string;
  avatarInitial: string;
  avatarUrl?: string | null;
}

export interface Post {
  id: string;
  author: ApiAuthor;
  content: string;
  intention: "registrar" | "compartilhar" | "desabafar" | "refletir";
  createdAt: string;
  _count: { replies: number };
  // touchedCount não existe — interação privada, nunca exposta
  // Estes campos são retornados apenas pelo feed autenticado
  touched?: boolean;
  saved?: boolean;
}

export interface Reply {
  id: string;
  author: ApiAuthor;
  content: string;
  createdAt: string;
}

export interface ApiInterest {
  interest: string;
}

export interface PublicProfile {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  avatarInitial: string;
  avatarUrl?: string | null;
  joinedAt: string;
  interests: ApiInterest[];
}

export interface MyProfile extends PublicProfile {
  onboardingDone: boolean;
}

export interface AppNotification {
  id: string;
  type: "new_reply";
  referenceId: string | null;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  createdAt: string;
  otherProfile: {
    id: string;
    name: string;
    username: string;
    avatarInitial: string;
    avatarUrl?: string | null;
  } | null;
  lastMessage: {
    id: string;
    content: string;
    sentAt: string;
    senderId: string;
  } | null;
  unread: boolean;
}

export interface Message {
  id: string;
  content: string;
  sentAt: string;
  editedAt: string | null;
  senderId: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatarInitial: string;
    avatarUrl?: string | null;
  };
}

export interface ConversationDetail {
  conversationId: string;
  otherProfile: {
    id: string;
    name: string;
    username: string;
    avatarInitial: string;
    avatarUrl?: string | null;
  } | null;
  messages: Message[];
  canSend: boolean;
  unlocksAt: string | null;
}

export interface WellbeingSettings {
  reducedNotifications: boolean;
  hideInteractions: boolean;
  limitedFeed: boolean;
  silentMode: boolean;
  darkMode: boolean;
}
