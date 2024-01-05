import { Response } from "express";
import { LoginRequest } from "../model/user/login.request";

export interface AuthService {

    login(response: Response, login: LoginRequest): Promise<void>;

}