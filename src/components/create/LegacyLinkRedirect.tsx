"use client";

import { useEffect } from "react";

// 송금 화면이 /pay로 옮겨지기 전에 발급된 QR(`/#b=&a=&h=`)을 계속 열리게 한다.
// fragment는 브라우저에서만 읽을 수 있어 마운트 후 이동한다(서버로 전송되지 않는다)
export default function LegacyLinkRedirect() {
  useEffect(() => {
    const { hash } = window.location;
    // 옛 형식(`#b=`로 시작)만 옮긴다. 그 밖의 임의 hash는 /pay에서 무효 링크가 되므로 그대로 둔다
    if (hash.startsWith("#b=")) window.location.replace(`/pay${hash}`);
  }, []);

  return null;
}
