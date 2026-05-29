"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";

type SourceStatus = "idle" | "loading" | "ready" | "fallback";

export function useComponentSource(fallbackContent: string, sourceId?: string) {
  const pathname = usePathname();
  const resolvedSourceId = sourceId ?? pathname;
  const [content, setContent] = useState(fallbackContent);
  const [status, setStatus] = useState<SourceStatus>("idle");

  const loadSource = useCallback(async () => {
    if (!resolvedSourceId) {
      setContent(fallbackContent);
      setStatus("fallback");
      return fallbackContent;
    }

    setStatus("loading");

    try {
      const response = await fetch(
        `/api/component-source?id=${encodeURIComponent(resolvedSourceId)}`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error(`Unable to load component source for ${resolvedSourceId}`);
      }

      const source = await response.text();
      setContent(source);
      setStatus("ready");
      return source;
    } catch {
      setContent(fallbackContent);
      setStatus("fallback");
      return fallbackContent;
    }
  }, [fallbackContent, resolvedSourceId]);

  return { content, loadSource, status };
}
