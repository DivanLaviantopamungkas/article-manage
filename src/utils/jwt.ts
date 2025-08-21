// src/utils/jwt.ts
export function getJwtExpiryInSeconds(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    if (payload?.exp) {
      const now = Math.floor(Date.now() / 1000);
      const remaining = payload.exp - now;
      return remaining > 0 ? remaining : null;
    }
    return null;
  } catch {
    return null;
  }
}
