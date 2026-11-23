"use client";

import { useMemo } from "react";
import NoticeText from "@/components/create/NoticeText";
import AccountCard from "@/components/transfer/AccountCard";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/useCopy";

// QR 바깥 여백(quiet zone). 스캔 안정성을 위해 규격 최소값인 4모듈을 둔다
const QUIET_ZONE = 4;
// PNG 저장 해상도: 모듈당 픽셀 수
const PNG_MODULE_PX = 10;
const PNG_FILE_NAME = "gospelfix-pay-qr.png";

interface QrPreviewProps {
  bankLabel: string;
  accountNumber: string;
  accountHolder: string;
  // 이 값이 QR에 담긴 주소다(링크 복사에 그대로 쓴다)
  url: string;
  matrix: boolean[][];
}

// 가로로 이어진 검은 모듈을 한 번에 그려 path 길이를 줄인다
function buildPathData(matrix: boolean[][]): string {
  const segments: string[] = [];
  matrix.forEach((row, r) => {
    let c = 0;
    while (c < row.length) {
      if (!row[c]) {
        c += 1;
        continue;
      }
      const start = c;
      while (c < row.length && row[c]) c += 1;
      segments.push(`M${start + QUIET_ZONE} ${r + QUIET_ZONE}h${c - start}v1h-${c - start}z`);
    }
  });
  return segments.join("");
}

// 행렬을 canvas에 직접 그려 PNG로 내려받는다(서버·외부 라이브러리 없음)
function downloadPng(matrix: boolean[][]) {
  const total = matrix.length + QUIET_ZONE * 2;
  const canvas = document.createElement("canvas");
  canvas.width = total * PNG_MODULE_PX;
  canvas.height = total * PNG_MODULE_PX;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";
  matrix.forEach((row, r) => {
    row.forEach((dark, c) => {
      if (!dark) return;
      ctx.fillRect(
        (c + QUIET_ZONE) * PNG_MODULE_PX,
        (r + QUIET_ZONE) * PNG_MODULE_PX,
        PNG_MODULE_PX,
        PNG_MODULE_PX,
      );
    });
  });
  canvas.toBlob((blob) => {
    if (!blob) return;
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = PNG_FILE_NAME;
    a.click();
    // 일부 브라우저는 클릭 직후 해제하면 다운로드가 끊겨 잠시 뒤에 해제한다
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
  }, "image/png");
}

// 만든 사람이 오입력을 잡도록 입력 요약을 QR 위에 두고, 아래에 QR과 보조 동작을 둔다
export default function QrPreview({
  bankLabel,
  accountNumber,
  accountHolder,
  url,
  matrix,
}: QrPreviewProps) {
  const { lastLabel, copy } = useCopy(url);
  const pathData = useMemo(() => buildPathData(matrix), [matrix]);
  const total = matrix.length + QUIET_ZONE * 2;

  return (
    <section aria-label="만든 QR" className="space-y-4">
      <AccountCard
        bankName={bankLabel}
        accountNumber={accountNumber}
        accountHolder={accountHolder}
      />
      {/* QR은 스캔 안정성을 위해 테마와 무관하게 흰 바탕·검정 모듈로 고정한다(색 이름은 SVG 속성) */}
      <div className="overflow-hidden rounded-2xl border border-border">
        <svg
          role="img"
          aria-label="송금 안내 QR 코드"
          viewBox={`0 0 ${total} ${total}`}
          shapeRendering="crispEdges"
          className="block h-auto w-full"
        >
          <rect width={total} height={total} fill="white" />
          <path d={pathData} fill="black" />
        </svg>
      </div>
      <NoticeText>QR을 공유하기 전에 은행·계좌번호·예금주를 꼭 확인해 주세요.</NoticeText>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" type="button" onClick={() => downloadPng(matrix)}>
          PNG로 저장
        </Button>
        <Button variant="outline" type="button" onClick={() => void copy("link")}>
          링크 복사
        </Button>
      </div>
      <p role="status" className="min-h-4 text-[13px] text-muted-foreground">
        {lastLabel === "link" ? "링크를 복사했어요." : ""}
      </p>
    </section>
  );
}
