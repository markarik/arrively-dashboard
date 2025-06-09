import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateConvert'
})
export class DateConvertPipe implements PipeTransform {
transform(createdDate: any, format: 'yyyy-MM-dd' | 'yyyy-MMM-dd'): unknown {
  if (!createdDate) return '';
  const dateObj = new Date(createdDate);
  const formattedDate = new DatePipe('en-US').transform(dateObj, format);
  return formattedDate;
}

}
