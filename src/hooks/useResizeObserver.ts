import { useEffect } from "react"

export const useResizeObserver = <T extends Element>(
  containerRef: React.RefObject<HTMLDivElement>,
  resizeHandler: (entry: ResizeObserverEntry, observer?: ResizeObserver) => void
) => {
  useEffect(() => {
    const element = containerRef.current;
    if(element !== null) {
      const resizerObserver = new ResizeObserver((entries: ResizeObserverEntry[], observer: ResizeObserver) => {
        for(const entry of entries) resizeHandler(entry, observer);
      });
      resizerObserver.observe(element);
      return () => {
        resizerObserver.unobserve(element);
      }
    }
  }, [resizeHandler, containerRef]);
}