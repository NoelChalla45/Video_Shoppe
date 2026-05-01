// Shared API helpers for frontend requests.
const configuredApiUrl = String(import.meta.env.VITE_API_URL || "").trim();
const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, "");
const isLocalDevHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// In production, default to same-origin instead of localhost.
export const API_BASE_URL = normalizedApiUrl || (isLocalDevHost ? "http://localhost:5000" : "");

export async function apiFetch(path, options = {}) {
  const { token, headers, ...rest } = options;
  const url = `${API_BASE_URL}${path}`;
  const finalHeaders = {
    ...(headers || {}),
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  if (rest.body && !("Content-Type" in finalHeaders)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    API_BASE_URL.startsWith("http://")
  ) {
    throw new Error(
      `Frontend is running on HTTPS but VITE_API_URL is HTTP (${API_BASE_URL}). Use an HTTPS backend URL in Vercel environment variables.`
    );
  }

  try {
    return await fetch(url, {
      ...rest,
      headers: finalHeaders,
    });
  } catch (error) {
    const reason = error instanceof Error && error.message ? ` Original error: ${error.message}` : "";
    const target = API_BASE_URL || "same-origin /api";
    throw new Error(`Could not reach the API target (${target}). Check VITE_API_URL, backend deployment status, and backend CORS settings.${reason}`);
  }
}

export async function apiFetchJson(path, options = {}) {
  const response = await apiFetch(path, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || options.errorMessage || "Request failed.");
  }

  return payload;
}
