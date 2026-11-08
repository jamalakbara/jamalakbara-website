import Link from "next/link";
import type { ComponentPropsWithRef, ComponentProps } from "react";
import { Loader } from "@/components/site/icons";

type Variant = "primary" | "secondary";

function buttonClass(variant: Variant, className?: string) {
  return `f-btn f-btn--${variant}${className ? ` ${className}` : ""}`;
}

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: Variant;
  loading?: boolean;
};

export function Button({ variant = "primary", loading = false, disabled, type = "button", className, children, ...props }: ButtonProps) {
  return (
    <button {...props} type={type} className={buttonClass(variant, className)} disabled={disabled || loading} aria-busy={loading || undefined}>
      {loading && <Loader size={16} className="f-btn__loader" />}
      {children}
    </button>
  );
}

export type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link {...props} className={buttonClass(variant, className)} />;
}

export type IconButtonProps = Omit<ComponentPropsWithRef<"button">, "aria-label"> & {
  "aria-label": string;
};

export function IconButton({ type = "button", className, ...props }: IconButtonProps) {
  return <button {...props} type={type} className={`f-iconbtn${className ? ` ${className}` : ""}`} />;
}
