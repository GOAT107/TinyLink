export function formatDateTime(
    value: string | Date | null | undefined,
    fallback: string = '',
  ): string {
    if (!value) return fallback;
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  export function formatLastClicked(
    value: string | Date | null | undefined,
  ): string {
    if (!value) return 'Never';
    return formatDateTime(value);
  }
  