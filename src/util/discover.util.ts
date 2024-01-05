import path from "path";

export class Discover {
    public static functionCaller(level: number = 0, ot?: string): string {
        const stackTrace = new Error().stack;
        const callerLine = stackTrace?.split('\n')[level + 2]; // Adjusted index based on level

        const matches = callerLine?.match(/\(([^:]+):(\d+):(\d+)\)/);
        return matches ? path.basename(matches[1], '.ts') : ot || 'unknown caller';
    }
}


