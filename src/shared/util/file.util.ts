import fs from 'fs';
import path from 'path';

export class FileUtil {
  /**
   * Check if a file exists at the provided path.
   * @param filePath - The path to the file.
   * @returns A boolean indicating whether the file exists.
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Read the content of a file at the provided path.
   * @param filePath - The path to the file.
   * @returns The content of the file as a string.
   * @throws An error if the file does not exist or cannot be read.
   */
  static readFile(filePath: string): string {
    if (!this.fileExists(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Error reading file at path: ${filePath}. Error: ${error instanceof Error ? error.message : error}`);
    }
  }

  static buildFilePath(...paths: string[]) {
    return path.join(...paths);
  }
}