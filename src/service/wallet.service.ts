import { AddToWalletRequest } from "../model/wallet/add-to-wallet.request";
import { AddToWalletResponse } from "../model/wallet/add-to-wallet.response";
import { CreateWalletRequest } from "../model/wallet/create-wallet.request";
import { CreateWalletResponse } from "../model/wallet/create-wallet.response";
import { SubFromWalletRequest } from "../model/wallet/sub-from-wallet.request";
import { SubFromWalletResponse } from "../model/wallet/sub-from-wallet.response";
import { WalletResponse } from "../model/wallet/wallet.response";

export default interface WalletService {
    createWallet(dto: CreateWalletRequest): Promise<CreateWalletResponse>;
    findWallet(userId: string, walletName: string): Promise<WalletResponse>;
    addBalanceToWallet(dto: AddToWalletRequest): Promise<AddToWalletResponse>;
    subtractBalanceFromWallet(dto: SubFromWalletRequest): Promise<SubFromWalletResponse>
}