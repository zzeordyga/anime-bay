export function truncate(text: string | null | undefined, length: number, addition = ''): string {
  if (!text) return '';
  if (text.length <= length) return text;
  const sliced = text.slice(0, length);
  const lastSpace = sliced.lastIndexOf(' ');
  return (lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced) + addition;
}

export function convertDate(year: number | null, month: number | null, day: number | null): string {
  if (!year) return 'Unknown';
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}