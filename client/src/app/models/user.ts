export class User {
    email: string;
    _id: string;
    createdAt: Date;
    __v: number;
    plan : string;
    role : string;

    constructor(email: string, _id: string, createdAt: Date, __v: number, plan : string, role : string) {
        this.email = email;
        this._id = _id;
        this.createdAt = createdAt;
        this.__v = __v;
        this.plan = plan;
        this.role = role;
        
    }
}
