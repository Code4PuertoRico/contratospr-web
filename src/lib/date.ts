import format from 'date-fns/format';
import es from 'date-fns/locale/es';

const DATE_FORMATS: { [key: string]: string } = {
  default: 'D [de] MMMM [de] YYYY',
  short: 'D/MMM/YYYY'
};

export function formatDate(
  date: Date | string,
  formatStr: string = 'default'
): string {
  return format(date, DATE_FORMATS[formatStr] || formatStr, { locale: es });
}
