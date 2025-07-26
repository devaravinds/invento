import { User } from "src/user/user.entity";
import { hashSync, compareSync } from 'bcrypt';
import { LoginResponse } from "./authentication.dto";


export class AuthenticationServiceHelper {


    static isPasswordValid(password: string, hashedPassword: string) {
        return compareSync(password, hashedPassword);
    }

    static createLoginResponse(user: User, token: string): LoginResponse {
        return {
            token,
            user: {
                id: user['_id']?.toString?.(),
                phone: user.phone,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
            },
        };
    }

    static hash(input: string, saltRounds = 10): string {
        return hashSync(input, saltRounds);
    }
}