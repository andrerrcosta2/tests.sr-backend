import { Transaction } from "sequelize";
import { CreateUserRequest } from "../model/user/create-user.request";
import { CreateUserResponse } from "../model/user/create-user.response";

export interface UserService {
    createUser(dto: CreateUserRequest, transaction?: Transaction): Promise<CreateUserResponse>;
}