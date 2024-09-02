import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string, format: string = 'short'): string | null {
    if (!value) 
      return null;

    const dateString = value.split('.')[0];
    const date = new Date(dateString.replace(' ', 'T') + 'Z');
    const datePipe = new DatePipe('en-US');

    return datePipe.transform(date, format);
  }
}
