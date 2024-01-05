export type RetryOptions = {
    maxAttempts: number;
    delayBetweenAttemptsMs: number;
};

async function retry<T>(
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
                throw new Error(`Max retry attempts reached (${options.maxAttempts}). Last error: ${error}`);
            }
            // Delay before next attempt
            await new Promise((resolve) => setTimeout(resolve, options.delayBetweenAttemptsMs));
        }
    }
    throw new Error(`Unexpected error in retry function.`);
}