import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sizeFile',
})
export class SizeFilePipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    if (value > 1048576) {
      return (value / 1024 / 1024).toFixed(2) + ' MB';
    } else {
      return (value / 1024).toFixed(2) + ' KB';
    }
  }
}
