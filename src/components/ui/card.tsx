import { ReactNode, HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl p-4 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...rest }: CardProps) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}

