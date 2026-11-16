import Link from 'next/link';
import type { ReactNode } from 'react';

type Size = 'xs' | 'sm' | 'md';

interface Props {
  children: ReactNode;
  active?: boolean;
  size?: Size;
  href?: string;
  onClick?: () => void;
  role?: string;
  className?: string;
}

const SIZES: Record<Size, string> = {
  xs: 'px-2 py-0.5 text-[11px]',
  sm: 'px-3 py-1 text-xs',
  md: 'px-3.5 py-1.5 text-sm',
};

// Pill used for genres, filters and meta tags. Renders a link, button or static span.
export default function Chip({ children, active, size = 'md', href, onClick, role, className = '' }: Props) {
  const base = `inline-flex items-center gap-1 whitespace-nowrap rounded-full border font-medium leading-none transition-colors ${SIZES[size]} ${className}`;
  const style = active
    ? { background: 'var(--brand)', borderColor: 'var(--brand)', color: '#fff' }
    : { background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text)' };

  if (href) return <Link href={href} className={`${base} hover:border-[color:var(--brand)]`} style={style}>{children}</Link>;
  if (onClick) {
    return (
      <button type="button" role={role} aria-pressed={role ? undefined : !!active} aria-selected={role ? !!active : undefined} onClick={onClick} className={`${base} cursor-pointer hover:border-[color:var(--brand)]`} style={style}>
        {children}
      </button>
    );
  }
  return <span className={base} style={style}>{children}</span>;
}
