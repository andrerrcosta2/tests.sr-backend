import path from "path";
import { isProduction } from "../../_cfg/environment.config";


export const dbg = (...message: any[]): void => {

    // if (!isProduction) {

        const stackTrace = new Error().stack;

        // The stack trace will have multiple lines. The third line usually contains the module (service) that called this function.
        const callerLine = stackTrace?.split('\n')[2];

        // Extract the filename from the caller line using a regular expression
        const matches = callerLine?.match(/\(([^:]+):(\d+):(\d+)\)/);
        const fileName = matches ? path.basename(matches[1], '.ts') : 'UnknownService';

        console.log("\n\n[" + fileName + "]:\n", ...message, "\n\n");
    // }
}