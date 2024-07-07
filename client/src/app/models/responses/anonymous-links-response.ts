import { AnonymousLink } from "../anonymous-link";

export class AnonymousLinksResponse{
    type : string;
    links : AnonymousLink[];

    constructor(type: string, links: AnonymousLink[]){
        this.type = type;
        this.links = links;
    }
}