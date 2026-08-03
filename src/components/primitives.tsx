'use client';

import styled from '@emotion/styled';

export const Container = styled.div<{ maxWidth?: number }>`
  max-width: ${({ maxWidth = 80 }) => maxWidth}rem;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  @media (min-width: 1024px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

export const Grid = styled.div<{ cols?: number }>`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(${({ cols = 5 }) => cols}, 1fr);
  }
`;

export const Surface = styled.div`
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid var(--border);
  border-top-color: var(--brand);
  border-bottom-color: var(--brand);
  animation: spin 0.9s linear infinite;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;