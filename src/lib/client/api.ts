export async function fetchApi<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const url = new URL(path, window.location.origin);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(
      (error as { error: string }).error ?? `API error ${res.status}`,
    );
  }

  return res.json() as Promise<T>;
}
