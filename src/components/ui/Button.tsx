import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline";

const BASE_CLASS =
  "flex h-12 w-full items-center justify-center rounded-lg text-base font-semibold";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-black text-white",
  outline: "border border-gray-300",
};

// <a> 링크 버튼도 같은 모양을 쓰도록 클래스만 따로 내보낸다
export function buttonClassName(variant: ButtonVariant): string {
  return `${BASE_CLASS} ${VARIANT_CLASS[variant]}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={className ? `${buttonClassName(variant)} ${className}` : buttonClassName(variant)}
      {...props}
    />
  );
}
