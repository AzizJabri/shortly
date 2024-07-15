import { Change } from '../change';
export class StatsResponse {
    totalClicks: number;
    clicksLast30Days: number;
    clicksLast7Days: number;
    clicksLast24Hours: number;
    changes?: {
        last30Days: Change;
        last7Days: Change;
        last24Hours: Change;
    };
    monthIntervalName : string;

    constructor(
        totalClicks: number,
        clicksLast30Days: number,
        clicksLast7Days: number,
        clicksLast24Hours: number,
        changes: {
            last30Days: Change,
            last7Days: Change,
            last24Hours: Change
        },
        monthIntervalName : string
    ) {
        this.totalClicks = totalClicks;
        this.clicksLast30Days = clicksLast30Days;
        this.clicksLast7Days = clicksLast7Days;
        this.clicksLast24Hours = clicksLast24Hours;
        this.changes = changes;
        this.monthIntervalName = monthIntervalName;
    }
}