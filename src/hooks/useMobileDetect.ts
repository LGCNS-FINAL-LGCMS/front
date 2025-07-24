import { useState, useEffect, useCallback } from "react";

const useMobileDetect = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  const handleResize = useCallback((): void => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < breakpoint);
    }
  }, [breakpoint]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return isMobile;
};

export default useMobileDetect;
