const TOKEN_KEY = "entrelinhas_token";
const PROFILE_ID_KEY = "entrelinhas_profile_id";

function isBrowser() {
  return typeof window !== "undefined";
}

export const authStorage = {
  getToken: (): string | null =>
    isBrowser() ? localStorage.getItem(TOKEN_KEY) : null,

  getProfileId: (): string | null =>
    isBrowser() ? localStorage.getItem(PROFILE_ID_KEY) : null,

  set: (token: string, profileId: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(PROFILE_ID_KEY, profileId);
  },

  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_ID_KEY);
  },
};
