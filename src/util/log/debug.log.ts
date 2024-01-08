import path from "path";
// import { isProduction } from "../../_cfg/environment.config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dbg = (...message: any[]): void => {

    // if (!isProduction) {

    const stackTrace = new Error().stack;

    const callerLine = stackTrace?.split('\n')[2];

    const matches = callerLine?.match(/\(([^:]+):(\d+):(\d+)\)/);
    const fileName = matches ? path.basename(matches[1], '.ts') : 'UnknownService';

    console.log("\n\n[" + fileName + "]:\n", ...message, "\n\n");
    // }
}