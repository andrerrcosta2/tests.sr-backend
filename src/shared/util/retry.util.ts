export type RetryOptions = {
    maxAttempts: number;
    delayBetweenAttemptsMs: number;
};

export default async function retry<T>(
    operation: () => Promise<T>,
    options: RetryOptions
): Promise<T> {
    let attempts = 0;
    while (attempts < options.maxAttempts) {
        try {
            return await operation();
        } catch (error) {
            attempts++;
            if (attempts === options.maxAttempts) {
                console.debug(`Max retry attempts reached (${options.maxAttempts}). Last error: ${error}`);
                throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, options.delayBetweenAttemptsMs));
        }
    }
    throw new Error(`Unexpected error in retry function.`);
}