'use client';

import styled from '@emotion/styled';
import Link from 'next/link';

export const Button = styled.button<{ variant?: 'brand' | 'ghost' | 'danger'; size?: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: var(--radius);
  border: 1px solid transparent;
  font-weight: 550;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s, border-color 0.15s;
  padding: ${({ size = 'md' }) => (size === 'sm' ? '0.4rem 0.8rem' : '0.625rem 1rem')};
  font-size: ${({ size = 'md' }) => (size === 'sm' ? '0.85rem' : '0.95rem')};

  ${({ variant = 'ghost' }) =>
    variant === 'brand' &&
    `background-color: var(--brand); color: #fff; &:hover { background-color: var(--brand-strong); }`}
  ${({ variant = 'ghost' }) =>
    variant === 'ghost' &&
    `background-color: transparent; border-color: var(--border); color: var(--text); &:hover { background-color: var(--surface-2); }`}
  ${({ variant = 'danger' }) =>
    variant === 'danger' &&
    `background-color: transparent; color: var(--danger); border-color: var(--danger); &:hover { background-color: var(--danger); color: #fff; }`}

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const LinkButton = styled(Link)<{ active?: boolean }>`
  font-weight: 550;
  color: var(--text);
  &:hover { color: var(--brand); }
  ${({ active }) => active && `color: var(--brand);`}
`;