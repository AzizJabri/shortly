import { User } from "../user";

export class MeResponse{
    type : string;
    user : User;

    constructor(type: string, user: User){
        this.type = type;
        this.user = user;
    }
}