import type { ComponentProps } from "react";

export interface __Name__Props extends ComponentProps<"div"> {
  label: string;
}

export function __Name__({ label, className, ...rest }: __Name__Props) {
  return (
    <div className={`rounded-md p-4 ${className ?? ""}`} {...rest}>
      {label}
    </div>
  );
}
