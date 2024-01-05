import bcrypt from 'bcrypt';

export class BCryptUtil {
    private static readonly SALT_ROUNDS = 10; // Adjust as needed based on your security requirements

    /**
     * Encrypts the given value using bcrypt hash function with the specified salt.
     * @param value - The value (password) to be encrypted.
     * @param salt - The salt to be used for hashing (optional).
     * @returns
     */
    static async encrypt(value: string, salt?: string): Promise<string> {
        try {
            const generatedSalt = salt ? salt : await bcrypt.genSalt(this.SALT_ROUNDS);

            const hash = await bcrypt.hash(value, generatedSalt);

            return hash;
        } catch (error: unknown) {

            throw new Error(`Error encrypting value: ${error instanceof Error ? error.message : error}`);
        }
    }

    /**
     * Decrypts (verifies) the given value against the specified hash using bcrypt compare function.
     * @param value - The value (password) to be decrypted (verified).
     * @param hash - The hash to be verified against the value.
     * @returns 
     */
    static async decrypt(value: string, hash: string): Promise<boolean> {
        try {
            // Compare the value with the hash using bcrypt compare function
            const isMatch = await bcrypt.compare(value, hash);

            return isMatch;
        } catch (error) {
            throw new Error(`Error decrypting value: ${error instanceof Error ? error.message: error}`);
        }
    }
}