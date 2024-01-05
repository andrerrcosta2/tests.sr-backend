import { Transaction } from "sequelize";
import { UserEntity } from "../data-access/user/entity/user.entity";

export interface UserRepository {
    /**
     * 
     * @param user 
     * @param transaction 
     */
    save(user: UserEntity, transaction?: Transaction): Promise<UserEntity>;
    /**
     * 
     * @param id 
     * @param transaction 
     */
    findById(id: string, transaction?: Transaction): Promise<UserEntity | null>;
    /**
     * 
     * @param email 
     * @param transaction 
     */
    findByEmail(email: string, transaction?: Transaction): Promise<UserEntity | null>
}