import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringTruncate'
})
export class StringTrancatePipe implements PipeTransform {

  transform(value: string, limit = 10, completeWords = false, ellipsis = '...'): string {
    if (!value) return ''; // Handle empty values
    if (value.length <= limit) return value; // No truncation needed

    let truncatedText = value.substring(0, limit);
    if (completeWords) {
      // Truncate at the nearest word boundary
      const lastSpace = truncatedText.lastIndexOf(' ');
      if (lastSpace !== -1) {
        truncatedText = truncatedText.substring(0, lastSpace);
      }
    }
    return truncatedText + ellipsis;
  }
}