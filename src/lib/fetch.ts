// lib/fetch.ts
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retries = 2
): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok && retries > 0 && res.status >= 500) {
      return fetchWithRetry(url, options, retries - 1);
    }
    return res;
  } catch (error) {
    if (retries > 0) {
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}