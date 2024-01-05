import { WalletEntity } from "../data-access/wallet/entity/wallet.entity";

export interface WalletRepository {
    /**
     * 
     * @param userId 
     * @param walletName 
     */
    findByUserAndWalletName(userId: string, walletName: string): Promise<WalletEntity | null>;
    /**
     * 
     * @param entity 
     */
    save(entity: WalletEntity): Promise<WalletEntity>;
    /**
     * 
     * @param userId 
     * @param walletName 
     * @param amount 
     */
    increaseBalance(userId: string, walletName: string, amount: number): Promise<WalletEntity | null>;
    /**
     * 
     * @param userId 
     * @param walletName 
     * @param amount 
     */
    decreaseBalance(userId: string, walletName: string, amount: number): Promise<WalletEntity | null>;
}