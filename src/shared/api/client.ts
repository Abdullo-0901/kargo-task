import { API_BASE_URL } from "./base";

export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}
