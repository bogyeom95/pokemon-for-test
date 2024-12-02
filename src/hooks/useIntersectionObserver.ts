import { useEffect, useRef, RefObject } from "react";

const useIntersectionObserver = <T extends HTMLElement>(
  callback: () => void,
  options: IntersectionObserverInit = { threshold: 1.0 }
): [RefObject<T>] => {
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;
    console.log(targetRef.current);

    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        callback();
      }
    }, options);

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return [targetRef];
};

export default useIntersectionObserver;
