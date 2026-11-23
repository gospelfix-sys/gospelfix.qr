import { Button, buttonVariants } from "@/components/ui/button";
import { COPY_GUIDE_APPS, FINANCE_APPS } from "@/lib/apps";
import type { Transfer } from "@/lib/parseTransfer";
import { cn } from "@/lib/utils";

interface AppGridProps {
  transfer: Transfer;
  // 복사 타일을 눌렀을 때 호출. 앱 이름은 안내 문구에 쓴다
  onCopy: (appName: string) => void;
  // 마지막으로 복사한 타일의 앱 이름 (없으면 안내 문구를 숨긴다)
  copiedAppName: string | null;
}

// 금융앱 타일. 글자만 쓰고 로고·상표는 쓰지 않는다(제휴로 오해될 수 있음)
export default function AppGrid({ transfer, onCopy, copiedAppName }: AppGridProps) {
  const copyTiles = [...FINANCE_APPS.filter((app) => !app.buildUrl(transfer)), ...COPY_GUIDE_APPS];

  return (
    <section aria-labelledby="app-grid-title" className="space-y-2">
      <h2 id="app-grid-title" className="text-[13px] font-semibold">
        자주 쓰는 앱
      </h2>
      <ul className="grid grid-cols-4 gap-2">
        {FINANCE_APPS.map((app) => {
          const url = app.buildUrl(transfer);
          if (!url) return null;
          return (
            <li key={app.id} className="flex">
              {/* 일반 <a>: 커스텀 스킴을 라우터가 가로채지 않게 한다 */}
              <a className={cn(buttonVariants({ variant: "outline" }), "w-full")} href={url}>
                {app.name}
              </a>
            </li>
          );
        })}
        {copyTiles.map((app) => (
          <li key={app.id} className="flex">
            <Button
              variant="outline"
              className="w-full"
              aria-pressed={copiedAppName === app.name}
              onClick={() => onCopy(app.name)}
            >
              {app.name}
            </Button>
          </li>
        ))}
      </ul>
      {/* 항상 렌더링해 두어야 내용이 바뀔 때 스크린리더가 읽는다 */}
      <p role="status" className="text-[13px] text-muted-foreground">
        {copiedAppName &&
          `계좌번호가 복사됐어요. ${copiedAppName} 앱을 열어 붙여넣어 주세요.`}
      </p>
    </section>
  );
}
