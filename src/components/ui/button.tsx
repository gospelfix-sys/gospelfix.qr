import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Tailwind 3.4 용으로 정리한 버튼. v4 전용 문법·알파 색·그림자·ring 장식은 두지 않는다.
// 굵기는 400/600, 높이는 모바일 터치 기준 48px 이다.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-foreground",
        // aria-pressed: 선택된 타일은 검정 2px 테두리로 구분한다(고정 높이라 레이아웃은 밀리지 않음)
        outline:
          "border-border bg-background text-foreground hover:bg-muted aria-pressed:border-2 aria-pressed:border-primary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 gap-2 px-2 text-[13px] font-normal",
        lg: "h-12 gap-2 px-4 text-base font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
