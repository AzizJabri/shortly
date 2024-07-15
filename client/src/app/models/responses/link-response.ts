import  {Link} from '../link';

export class LinkResponse{
    type : string;
    link : Link;

    constructor(link: Link, type: string){
        this.type = type;
        this.link = link;
    }
}