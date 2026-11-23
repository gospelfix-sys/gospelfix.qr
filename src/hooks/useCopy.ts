"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseCopyResult {
  // 복사 직후 resetMs 동안만 true (버튼 글자를 잠깐 바꾸는 용도)
  copied: boolean;
  // 마지막으로 복사에 성공한 출처 이름. 인라인 안내 문구가 계속 보이도록 타이머와 무관하게 유지한다
  lastLabel: string | null;
  copy: (label?: string) => Promise<void>;
}

// 클립보드 복사 로직의 단일 출처. 실패(권한·비보안 컨텍스트)는 조용히 넘기고 값은 기록하지 않는다
export function useCopy(value: string, resetMs = 1500): UseCopyResult {
  const [copied, setCopied] = useState(false);
  const [lastLabel, setLastLabel] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(
    async (label?: string) => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        // 복사에 실패했는데 "복사됐어요"라고 보이면 안 되므로 상태를 바꾸지 않는다
        return;
      }
      setLastLabel(label ?? null);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetMs);
    },
    [value, resetMs],
  );

  return { copied, lastLabel, copy };
}
