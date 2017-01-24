import * as path from 'path';
import * as fs from 'fs';
import { CompilerResult, FileResult } from '../compiler';
import { TsRuntimeOptions } from '../options/TsRuntimeOptions';
import { WriterConfig } from './WriterConfig';
import { WriterResult } from './WriterResult';

export class Writer {

  constructor(private transformerResult: CompilerResult) {

  }

  public writeAll(config?: WriterConfig): Promise<WriterResult[]> {
    const toWrite: Array<Promise<WriterResult>> = [];

    for (const fileResult of this.transformerResult.fileResults) {
      toWrite.push(this.writeFile(fileResult, config));
    }

    return Promise.all(toWrite);
  }

  public writeFile(fileResult: FileResult, config?: WriterConfig): Promise<WriterResult> {
    return new Promise((resolve, reject) => {
      const options: WriterConfig | TsRuntimeOptions = config || this.transformerResult.config.options;
      const file = fileResult.file.replace(new RegExp(`^${options.basePath}`), '');
      let location = path.join(options.writePath as string, file);

      location = path.join(
        path.dirname(path.join(options.writePath as string, file)),
        `${path.basename(location, '.ts')}.js`,
      );

      fs.writeFile(location, fileResult.transpiler.code, {
        encoding: options.encoding,
      }, err => {
        if (err) {
          return reject(`Error writing ${location}`);
        }

        console.log('--> Written:', location);

        resolve({
          fileResult,
          originalPath: fileResult.file,
          writePath: location,
        });
      });

      console.log('--> Writing:', location);
    });
  }

}