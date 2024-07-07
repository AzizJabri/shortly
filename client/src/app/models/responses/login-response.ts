import { User } from "../user";

export class LoginResponse {
    type: string;
    access_token: string;
    refresh_token: string;
    user: User;

    constructor(type: string, access_token: string, refresh_token: string, user: User) {
        this.type = type;
        this.access_token = access_token;
        this.refresh_token = refresh_token;
        this.user = user;
    }

}
