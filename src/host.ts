import * as path from 'path';
import * as ts from 'typescript';

export interface FileReflection {
  name: string;
  text: string;
}

export class Host implements ts.CompilerHost {

  private fileMap: Map<string, ts.SourceFile> = new Map();
  private outputs: Map<string, string> = new Map();

  private defaultLibFileName = 'node_modules/typescript/lib/lib.d.ts';
  private defaultLibLocation = 'node_modules/typescript/lib/';
  private currentDirectory = '';
  private caseSensitiveFileNames = false;
  private newLine = '\n';

  constructor(files: FileReflection[], private compilerOptions: ts.CompilerOptions, setParentNodes = true) {
    for (let file of files) {
      this.fileMap.set(
        file.name,
        ts.createSourceFile(
          file.name, file.text, compilerOptions.target, setParentNodes
        )
      );
    }
  }

  public getResult(): FileReflection[] {
    const result: FileReflection[] = [];
    const cwd = process.cwd();

    this.outputs.forEach((text, name) => {
      const sepRegExp = new RegExp(`^\\${path.sep}+`);
      name = name.split(`${cwd}${path.sep}`).join('');
      name = name.replace(sepRegExp, '');
      result.push({ name, text });
    });

    return result;
  }

  public setDefaultLibFileName(defaultLibFileName: string) {
    this.defaultLibFileName = defaultLibFileName;
  }

  public setDefaultLibLocation(defaultLibLocation: string) {
    this.defaultLibLocation = defaultLibLocation;
  }

  public setCurrentDirectory(currentDirectory: string) {
    this.currentDirectory = currentDirectory;
  }

  public setUseCaseSensitiveFileNames(useCaseSensitiveFileNames: boolean) {
    this.caseSensitiveFileNames = useCaseSensitiveFileNames;
  }

  public setNewLine(newLine: string) {
    this.newLine = newLine;
  }

  public getSourceFile(fileName: string) {
    return this.fileMap.get(fileName);
  }

  public getDefaultLibFileName(options: ts.CompilerOptions): string {
    return path.join(path.resolve(path.dirname(this.defaultLibFileName)), path.basename(this.defaultLibFileName));
  }

  public getDefaultLibLocation(): string {
    return path.resolve(this.defaultLibLocation);
  }

  public getCurrentDirectory(): string {
    return path.resolve(this.currentDirectory);
  }

  public getDirectories(path: string): string[] {
    return [];
  }

  public getCanonicalFileName(fileName: string): string {
    return fileName;
  }

  public useCaseSensitiveFileNames(): boolean {
    return this.caseSensitiveFileNames;
  }

  public getNewLine(): string {
    return this.newLine;
  }

  public fileExists(fileName: string): boolean {
    return this.fileMap.has(fileName);
  }

  public readFile(fileName: string): string {
    return this.fileMap.has(fileName) ? this.fileMap.get(fileName).text : undefined;
  }

  public writeFile(fileName: string, data: string, writeByteOrderMark?: boolean, onError?: (message: string) => void, sourceFiles?: ts.SourceFile[]): void {
    this.outputs.set(fileName, data);
  }

}
