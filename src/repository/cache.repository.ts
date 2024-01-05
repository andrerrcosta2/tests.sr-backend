export interface CacheRepository<T> {
    /**
     * 
     * @param entity 
     * 
     * @throws 
     */
    save(entity: T): Promise<void>;
    /**
     * 
     * @param id 
     */
    findById(id: string): Promise<T | null>;
}