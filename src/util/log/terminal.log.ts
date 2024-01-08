import path from "path";

export class Terminal {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static title(title: string, ...message: any[]) {
        const stackTrace = new Error().stack;

        const callerLine = stackTrace?.split('\n')[2];

        const matches = callerLine?.match(/\(([^:]+):(\d+):(\d+)\)/);
        const fileName = matches ? path.basename(matches[1], '.ts') : 'UnknownService';

        // ANSI escape codes for green background and black text
        const greenBackgroundBlackText = '\x1b[42m\x1b[30m';
        const greenText = '\x1b[32m';
        const resetColor = '\x1b[0m';

        const formatted = `${greenBackgroundBlackText}\n\n[${title}]:${resetColor} { ${message.concat(',')} \n} ${greenText}{${fileName}}${resetColor}\n`;

        console.log(formatted);
    }
}