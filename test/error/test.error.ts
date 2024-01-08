export class TestError extends Error {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(message: any, stack?: string) {
        super(message);
        this.name = 'TestError';
        this.stack = stack;
    }
}