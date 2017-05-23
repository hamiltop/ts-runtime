import * as chalk from 'chalk';
import { Options } from '../options';

export class TsrError extends Error {

}

export function getError(error: string | Error, options?: Options): string {
  let err = typeof error === 'string' ? error : '';

  if (error instanceof Error) {
    if (error.stack) {
      err += error.stack;
    }

    if (error.message && err.indexOf(error.message) === -1) {
      err = err ? `${error.message} ${err}` : error.message;
    }
  }


  if (options) {
    let limit = options.stackTrace;
    limit = typeof limit === 'string' ? parseInt(limit) : limit;
    limit = limit < 0 ? 0 : limit;
    limit = limit === undefined ? 3 : limit;

    const lines = limit === 0 ? 1 : limit + 1;
    const split = err.split('\n');
    const result = split.slice(0, lines);

    if (limit > 0 && split.length > result.length) {
      result.push(chalk.bold(`    -> There are ${split.length - lines} more results. Use option -s ${split.length - 1} to show the full stack trace.`));
    }

    return result.join('\n');;
  }

  return err;
}
