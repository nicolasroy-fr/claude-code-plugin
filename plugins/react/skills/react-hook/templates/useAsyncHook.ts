import { useEffect, useState } from "react";

export interface __name__Result<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
}

export function __name__<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
): __name__Result<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(undefined);

    fetcher(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setError(reason instanceof Error ? reason : new Error(String(reason)));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [fetcher]);

  return { data, error, isLoading };
}
