import format from 'date-fns/format';
import es from 'date-fns/locale/es';

const DEFAULT_FORMAT = 'D [de] MMMM [de] YYYY';

export function formatDate(
  date: Date | string,
  formatStr: string = DEFAULT_FORMAT
): string {
  return format(date, formatStr, { locale: es });
}
