import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from "../../src/data-access/user/entity/user.entity";
import { WalletEntity } from "../../src/data-access/wallet/entity/wallet.entity";

export class EntitySupplier {

    static users(users: number): UserEntity[] {
        const output: UserEntity[] = [];
        for (let i = 0; i < users; i++) {
            output.push(UserEntity.builder()
                .withId(uuidv4())
                .withEmail(`test${i}@email.com`)
                .withName(`testuser${i}`)
                .withPassword(`testpassword${i}`)
                .build());
        }
        return output;
    }

    static wallets(wallets: number, userIds: string[]): WalletEntity[] {
        const output: WalletEntity[] = [];
        if (userIds.length < wallets) throw new Error("Can't have more id's than wallets")
        for (let i = 0; i < wallets; i++) {
            output.push(WalletEntity.builder()
                .withId(uuidv4())
                .withUserId(userIds[i])
                .withWalletName(`testwallet${i}`)
                .withBalance(Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000)
                .build());
        }
        return output;
    }
}