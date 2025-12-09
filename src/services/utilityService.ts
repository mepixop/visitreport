import { Injectable } from '@nestjs/common';

/**
 * Provides utility functions for various tasks.
 */
@Injectable()
export class UtilityService {
  /**
   * Converts a Date object to a readable string format (e.g., "03 Dec 2025").
   * @param {Date} date The date to be formatted.
   * @returns {string} The formatted date string.
   */
  readableDate(date: Date): string {
    var parts = date.toString().split(' ');
    return `${parts[2]} ${parts[1]} ${parts[3]}`;
  }
}
//Wed Dec 03 2025 00:00:00 GMT+0100 (Central European Standard Time)
