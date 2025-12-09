import { Injectable } from '@nestjs/common';

/**
 * The main application service.
 */
@Injectable()
export class AppService {
  /**
   * Returns a simple 'Hello World!' string.
   * @returns {string} The greeting string.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
