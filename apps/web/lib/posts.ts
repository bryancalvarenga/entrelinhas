import { api } from "./api";
import { Post, Reply, PublicProfile, MyProfile, WellbeingSettings, AppNotification, ConversationSummary, ConversationDetail } from "./types";

export interface UpdateProfilePayload {
  name?: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export type PostIntention = "registrar" | "compartilhar" | "desabafar" | "refletir";

// Feed

export async function getFeed(): Promise<Post[]> {
  const data = await api.get<{ posts: Post[] }>("/feed");
  return data.posts;
}

// Posts

export async function getPost(id: string): Promise<Post> {
  return api.get<Post>(`/posts/${id}`);
}

export async function createPost(payload: {
  content: string;
  intention: PostIntention;
}): Promise<Post> {
  return api.post<Post>("/posts", payload);
}

// Replies

export async function getReplies(postId: string): Promise<Reply[]> {
  return api.get<Reply[]>(`/posts/${postId}/replies`);
}

export async function createReply(
  postId: string,
  content: string
): Promise<Reply> {
  return api.post<Reply>(`/posts/${postId}/replies`, { content });
}

// Touch — interação privada, retorna apenas { touched: boolean }

export async function getTouchStatus(
  postId: string
): Promise<{ touched: boolean }> {
  return api.get(`/posts/${postId}/touch`);
}

export async function touchPost(
  postId: string
): Promise<{ touched: boolean }> {
  return api.post(`/posts/${postId}/touch`, {});
}

export async function untouchPost(
  postId: string
): Promise<{ touched: boolean }> {
  return api.delete(`/posts/${postId}/touch`);
}

// Save — coleção privada

export async function getSaveStatus(
  postId: string
): Promise<{ saved: boolean }> {
  return api.get(`/posts/${postId}/save`);
}

export async function savePost(postId: string): Promise<{ saved: boolean }> {
  return api.post(`/posts/${postId}/save`, {});
}

export async function unsavePost(postId: string): Promise<{ saved: boolean }> {
  return api.delete(`/posts/${postId}/save`);
}

// Profiles

export async function getMyProfile(): Promise<MyProfile> {
  return api.get<MyProfile>("/profiles/me");
}

export async function updateMyProfile(payload: UpdateProfilePayload): Promise<PublicProfile> {
  return api.patch<PublicProfile>("/profiles/me", payload);
}

export async function getPublicProfile(username: string): Promise<PublicProfile> {
  return api.get<PublicProfile>(`/profiles/${username}`);
}

export async function getMyPosts(): Promise<Post[]> {
  return api.get<Post[]>("/profiles/me/posts");
}

export async function getProfilePosts(username: string): Promise<Post[]> {
  return api.get<Post[]>(`/profiles/${username}/posts`);
}

export async function getSavedPosts(): Promise<Post[]> {
  return api.get<Post[]>("/saved");
}

// Wellbeing

export async function getWellbeingSettings(): Promise<WellbeingSettings> {
  return api.get<WellbeingSettings>("/wellbeing");
}

export async function updateWellbeingSettings(
  settings: Partial<WellbeingSettings>
): Promise<WellbeingSettings> {
  return api.patch<WellbeingSettings>("/wellbeing", settings);
}

// Search

export async function searchPosts(q: string): Promise<Post[]> {
  return api.get<Post[]>(`/posts/search?q=${encodeURIComponent(q)}`);
}

export async function searchProfiles(q: string): Promise<PublicProfile[]> {
  return api.get<PublicProfile[]>(`/profiles/search?q=${encodeURIComponent(q)}`);
}

// Stats públicos — para homepage
export async function getStats(): Promise<{ users: number; posts: number }> {
  return api.get("/stats");
}

// Limit diário de publicação
export async function getCanPost(): Promise<{ canPost: boolean; nextPostAt: string }> {
  return api.get("/posts/can-post");
}

// Notifications

export async function getNotifications(): Promise<AppNotification[]> {
  return api.get<AppNotification[]>("/notifications");
}

export async function getNotificationCount(): Promise<{ count: number }> {
  return api.get<{ count: number }>("/notifications/count");
}

export async function markAllNotificationsRead(): Promise<{ done: boolean }> {
  return api.patch<{ done: boolean }>("/notifications/read", {});
}

export async function markNotificationRead(id: string): Promise<{ done: boolean }> {
  return api.patch<{ done: boolean }>(`/notifications/${id}/read`, {});
}

// Conversations / Messages
export async function findOrCreateConversation(recipientUsername: string): Promise<{ conversationId: string }> {
  return api.post<{ conversationId: string }>("/conversations", { recipientUsername });
}

export async function getConversations(): Promise<ConversationSummary[]> {
  return api.get<ConversationSummary[]>("/conversations");
}

export async function getConversation(id: string): Promise<ConversationDetail> {
  return api.get<ConversationDetail>(`/conversations/${id}`);
}

export async function sendMessage(conversationId: string, content: string) {
  return api.post(`/conversations/${conversationId}/messages`, { content });
}

export async function editMessage(conversationId: string, messageId: string, content: string) {
  return api.patch(`/conversations/${conversationId}/messages/${messageId}`, { content });
}

export async function deleteMessage(conversationId: string, messageId: string) {
  return api.delete(`/conversations/${conversationId}/messages/${messageId}`);
}

// Account
export async function deleteAccount(): Promise<{ deleted: boolean }> {
  return api.delete("/auth/account");
}

// Delete reply
export async function deleteReply(
  postId: string,
  replyId: string
): Promise<{ deleted: boolean }> {
  return api.delete(`/posts/${postId}/replies/${replyId}`);
}

// Delete post (author only)
export async function deletePost(postId: string): Promise<{ deleted: boolean }> {
  return api.delete(`/posts/${postId}`);
}
