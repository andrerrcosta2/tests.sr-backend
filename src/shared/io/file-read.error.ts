export class FileReadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FileReadError';
    }
}