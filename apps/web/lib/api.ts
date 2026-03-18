import { authStorage } from "./auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = authStorage.getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    authStorage.clear();
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
    throw new Error("Sessão expirada. Por favor, faça login novamente.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg = Array.isArray(body?.message)
      ? body.message[0]
      : (body?.message ?? "Erro na requisição");
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
