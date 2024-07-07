export class Link {
    _id: string;
    title: string;
    long_url: string;
    short_url: string;
    user: string;
    totalVisits: number;
    createdAt: Date;
    __v: number;

    constructor(_id: string, title: string, long_url: string, short_url: string, user: string, totalVisits: number, createdAt: Date, __v: number) {
        this._id = _id;
        this.title = title;
        this.long_url = long_url;
        this.short_url = short_url;
        this.user = user;
        this.totalVisits = totalVisits;
        this.createdAt = createdAt;
        this.__v = __v;
    }

}
