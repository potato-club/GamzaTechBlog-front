import { useEffect, useState } from "react";

/**
 * 로딩 상태에서 점 애니메이션을 제공하는 커스텀 훅
 *
 * @param isLoading - 로딩 상태
 * @returns 애니메이션 점 문자열 ("", ".", "..", "...")
 */
export const useLoadingDots = (isLoading: boolean): string => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading) {
      interval = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots.length >= 3) return ".";
          return prevDots + ".";
        });
      }, 500); // 0.5초마다 점 변경
    } else {
      setDots("");
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  return dots;
};
