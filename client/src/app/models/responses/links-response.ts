import  {Link} from '../link';

export class LinksResponse{
    type : string;
    links : Link[];
    currentPage : number;
    totalPages : number;
    totalLinks : number;

    constructor(links: Link[], currentPage: number, totalPages: number, totalLinks: number){
        this.type = 'links';
        this.links = links;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalLinks = totalLinks;
    }
}