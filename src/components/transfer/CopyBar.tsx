import { Button } from "@/components/ui/button";

interface CopyBarProps {
  copied: boolean;
  onCopy: () => void;
}

// 하단 고정 바. 화면당 하나뿐인 주 버튼을 엄지 닿는 곳에 둔다
export default function CopyBar({ copied, onCopy }: CopyBarProps) {
  return (
    <div className="sticky bottom-0 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="px-4 py-3">
        <Button size="lg" className="w-full" onClick={onCopy} aria-live="polite">
          {copied ? "복사됐어요" : "계좌번호 복사"}
        </Button>
      </div>
    </div>
  );
}
