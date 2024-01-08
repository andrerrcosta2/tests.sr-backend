import { v4 as UUIDV4 } from 'uuid';
import { CreateWalletRequest } from "../../../model/wallet/create-wallet.request";
import { WalletEntity } from "../entity/wallet.entity"
import { CreateWalletResponse } from '../../../model/wallet/create-wallet.response';
import { AddToWalletResponse } from '../../../model/wallet/add-to-wallet.response';
import { SubFromWalletResponse } from '../../../model/wallet/sub-from-wallet.response';
import { WalletResponse } from '../../../model/wallet/wallet.response';
import { injectable } from 'tsyringe';

@injectable()
export class WalletMapper {

    /**
     * 
     * @param request 
     * @returns 
     */
    public createWalletRequestToWalletEntity(request: CreateWalletRequest): WalletEntity {
        const entity = new WalletEntity();

        entity.id = UUIDV4();
        entity.walletName = request.walletName;
        entity.balance = request.balance;
        entity.userId = request.userId;

        return entity;
    }

    public walletEntityToCreateWalletResponse(entity: WalletEntity): CreateWalletResponse {
        const output: CreateWalletResponse = {
            id: entity.id,
            userId: entity.userId
        }

        return output;
    }

    public walletEntityToAddToWalletResponse(entity: WalletEntity): AddToWalletResponse {
        const output: AddToWalletResponse = {
            updatedBalance: entity.balance,
            message: "Operation successful"
        }
        return output;
    }

    public walletEntityToSubFromWalletResponse(entity: WalletEntity): SubFromWalletResponse {
        const output: SubFromWalletResponse = {
            updatedBalance: entity.balance,
            message: "Operation successful"
        }
        return output;
    }

    public walletEntityToWalletResponse(entity: WalletEntity): WalletResponse {
        const output: WalletResponse = {
            id: entity.id,
            userId: entity.userId,
            balance: entity.balance,
            walletName: entity.walletName
        }
        return output;
    }
}

