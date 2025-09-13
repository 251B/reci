import { useRef, useCallback } from "react";

export function useInfiniteScroll(hasMore, fetchMore) {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, fetchMore]
  );

  return lastElementRef;
}