import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

// Tailwind 3.4 용으로 정리한 입력창. 높이는 버튼과 같은 48px, 글자는 16px/400 이다
// (16px 미만이면 iOS Safari 가 포커스 때 화면을 확대한다). 그림자·알파 색·ring 장식은 두지 않고
// 포커스는 테두리 색 변화 + 버튼과 같은 2px ring 으로만 표시한다.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-2xl border border-input bg-card px-3 text-base font-normal text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-[invalid=true]:border-2 aria-[invalid=true]:border-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
