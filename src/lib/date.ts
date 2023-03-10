import format from "date-fns/format";
import isValid from "date-fns/isValid";
import parse from "date-fns/parse";

const DATE_FORMAT = 'yyyy-MM-dd';

export function parseDate(str: string): Date {
  const result = parse(str, DATE_FORMAT, new Date());
  if (!isValid(result)) {
    throw new Error(`parse error. str: ${str}`);
  }
  return result;
}

export function formatDate(date: Date): string {
  return format(date, DATE_FORMAT);
}
