import { DatePipe } from "@angular/common";

export function formatDate (date: Date | string | number, format: string = 'yyyy-MM-dd'): string {
  const dateParsed = new DatePipe('en-US').
  transform(date, format);

  return dateParsed;
}
