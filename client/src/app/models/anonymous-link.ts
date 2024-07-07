export class AnonymousLink {
    _id: string;
    long_url: string;
    short_url: string;
    session: string;
    createdAt: Date;
    __v: number;

    constructor(_id: string, long_url: string, short_url: string, session: string, createdAt: Date, __v: number) {
        this._id = _id;
        this.long_url = long_url;
        this.short_url = short_url;
        this.session = session;
        this.createdAt = createdAt;
        this.__v = __v;
    }

}
