import { v4 as UUIDV4 } from 'uuid';
import { CreateUserRequest } from '../../../model/user/create-user.request';
import { UserEntity } from '../entity/user.entity';
import { CreateUserResponse } from '../../../model/user/create-user.response';
import { injectable } from 'tsyringe';

@injectable()
export class UserMapper {

    public createUserRequestToUserEntity(createUserRequest: CreateUserRequest): UserEntity {
        const userEntity = new UserEntity();
    
        userEntity.id = UUIDV4();
        userEntity.name = createUserRequest.name;
        userEntity.email = createUserRequest.email;
        userEntity.password = createUserRequest.password;
    
        return userEntity;
    };
    
    public userEntityToCreateUserResponse(entity: UserEntity): CreateUserResponse {
        const output: CreateUserResponse = {
            id: entity.id
        }
    
        return output;
    };

}

