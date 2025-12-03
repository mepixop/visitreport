import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  readableDate(date: Date): string {
    var parts = date.toString().split(' ');
    return `${parts[2]} ${parts[1]} ${parts[3]}`;
  }
}
//Wed Dec 03 2025 00:00:00 GMT+0100 (Central European Standard Time)
