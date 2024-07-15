export class Change {
    type: string;
    percentage: number;

    constructor(type: string, percentage: number) {
        this.type = type;
        this.percentage = percentage;
    }
}