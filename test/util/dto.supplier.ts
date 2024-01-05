import { WalletEntity } from "../../src/data-access/wallet/entity/wallet.entity";
import { AddToWalletRequest } from "../../src/model/wallet/add-to-wallet.request";
import { SubFromWalletRequest } from "../../src/model/wallet/sub-from-wallet.request";

export class DtoSupplier {
    static addToWalletRequest(requests: number, wallets: WalletEntity[]) {
        const output: AddToWalletRequest[] = [];
        if (wallets.length < requests) throw new Error("Can't have more requests than wallets")
        for (let i = 0; i < requests; i++) {
            output.push({
                userId: wallets[i].userId,
                balance: Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000,
                walletName: wallets[i].walletName
            })
        }
    }

    static subFromWalletRequest(requests: number, wallets: WalletEntity[]) {
        const output: SubFromWalletRequest[] = [];
        if (wallets.length < requests) throw new Error("Can't have more requests than wallets")
        for (let i = 0; i < requests; i++) {
            output.push({
                userId: wallets[i].userId,
                balance: Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000,
                walletName: wallets[i].walletName
            })
        }
    }
}