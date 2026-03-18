import { api } from "./api";
import { Post, Reply, PublicProfile, MyProfile, WellbeingSettings } from "./types";

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
