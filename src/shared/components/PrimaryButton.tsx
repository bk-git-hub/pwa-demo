import type { ButtonHTMLAttributes, ReactNode } from 'react';

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function PrimaryButton({
  children,
  icon,
  variant = 'primary',
  type = 'button',
  ...props
}: PrimaryButtonProps) {
  return (
    <button className={`primaryButton ${variant}`} type={type} {...props}>
      {icon ? <span className="buttonIcon">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}
