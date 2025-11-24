import { useEffect, useState } from "react";
import { getPosts, type Post } from "./api";

export function usePosts(limit = 20) {
  const [data, setData] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getPosts(limit)
      .then((posts) => {
        if (!isMounted) return;
        setData(posts);
        setError(null);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error("Failed to load posts"));
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { data, isLoading, error };
}
