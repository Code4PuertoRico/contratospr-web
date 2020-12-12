import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import es from 'date-fns/locale/es';

const DATE_FORMATS: { [key: string]: string } = {
  default: "d 'de' MMMM 'de' yyyy",
  short: 'd/MMM/yyyy',
  shortTime: 'd/MMM/yyyy hh:mm a'
};

export function formatDate(
  date: Date | string,
  formatStr: string = 'default'
): string {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return format(date, DATE_FORMATS[formatStr] || formatStr, { locale: es });
}
