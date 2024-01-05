type Type = { new (...args: any[]): any };

export const isInstanceOfAny = (obj: any, ...types: Type[]): boolean => {
    for (const typeGuard of types) {
        if (obj instanceof typeGuard) {
            return true;
        }
    }
    return false;
}