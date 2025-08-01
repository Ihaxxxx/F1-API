export async function fetchWithRetries(url: string, retries = 3, delayMs = 500): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      } else {
        console.warn(`Attempt ${attempt} failed: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.warn(`Attempt ${attempt} error:`, err);
    }
    if (attempt < retries) {
      await new Promise((res) => setTimeout(res, delayMs)); // wait before retrying
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}
