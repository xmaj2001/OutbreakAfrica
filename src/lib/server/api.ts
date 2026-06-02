const WORKER_URL = process.env.WORKER_URL!;

export async function fetchWorker<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  if (!WORKER_URL) {
    console.error("WORKER_URL is not defined");
    throw new Error("WORKER_URL is not defined");
  }

  const url = new URL(`${WORKER_URL}${path}`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), {
    // // Next.js cache — revalida a cada 1 hora
    // next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(
      (error as { error: string }).error ?? `Worker error ${res.status}`,
    );
  }

  return res.json() as Promise<T>;
}
