import { Discover } from "../discover.util";

export class Formatter {

    public static error(...message: any[]): FormattedError {
        const filename = Discover.functionCaller();
        const formattedMessage = message.join(':::');

        return {
            string: () => `\n\n[${filename}]:\n${formattedMessage}\n\n`,
            json: () => ({
                caller: filename,
                message: formattedMessage
            })
        };
    }
}

interface FormattedError {
    string: () => string;
    json: () => { caller: string; message: string };
}