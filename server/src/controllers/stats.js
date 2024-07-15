const Link = require('../models/Link')
const Click = require('../models/Click')


const getStats = async (req, res) => {
    try {
        const links = await Link.find({ user: req.user.id });
        
        let totalClicks = 0;
        let clicksLast30Days = 0;
        let clicksLast7Days = 0;
        let clicksLast24Hours = 0;

        const now = new Date();
        const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        for (let link of links) {
            const clicks = await Click.find({ link: link._id });
            totalClicks += clicks.length;

            for (let click of clicks) {
                if (click.timestamp >= last30Days && click.timestamp <= now) {
                    clicksLast30Days++;
                }
                if (click.timestamp >= last7Days && click.timestamp <= now) {
                    clicksLast7Days++;
                }
                if (click.timestamp >= last24Hours && click.timestamp <= now) {
                    clicksLast24Hours++;
                }
            }
        }

        return res.status(200).json({
            totalClicks,
            clicksLast30Days,
            clicksLast7Days,
            clicksLast24Hours
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
};

const getStatsPremium = async (req, res) => {
    try {
        // Fetch all links for the user
        const links = await Link.find({ user: req.user.id });

        let totalClicks = 0;
        let clicksLast30Days = 0;
        let clicksPrevious30Days = 0;
        let clicksLast7Days = 0;
        let clicksPrevious7Days = 0;
        let clicksLast24Hours = 0;
        let clicksPrevious24Hours = 0;

        // Calculate date ranges
        const now = new Date();
        const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const previous30Days = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
        const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const previous7Days = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));
        const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        const previous24Hours = new Date(now.getTime() - (48 * 60 * 60 * 1000));

        for (let link of links) {
            const clicks = await Click.find({ link: link._id });
            totalClicks += clicks.length;

            for (let click of clicks) {
                if (click.timestamp >= last30Days && click.timestamp <= now) {
                    clicksLast30Days++;
                } else if (click.timestamp >= previous30Days && click.timestamp < last30Days) {
                    clicksPrevious30Days++;
                }
                if (click.timestamp >= last7Days && click.timestamp <= now) {
                    clicksLast7Days++;
                } else if (click.timestamp >= previous7Days && click.timestamp < last7Days) {
                    clicksPrevious7Days++;
                }
                if (click.timestamp >= last24Hours && click.timestamp <= now) {
                    clicksLast24Hours++;
                } else if (click.timestamp >= previous24Hours && click.timestamp < last24Hours) {
                    clicksPrevious24Hours++;
                }
            }
        }

        // Calculate percentage change for each period
        const calculateChange = (current, previous) => {
            if (previous === 0) {
                return current > 0 ? 100 : 0;
            }
            return ((current - previous) / previous) * 100;
        };

        const percentageChange30Days = calculateChange(clicksLast30Days, clicksPrevious30Days);
        const percentageChange7Days = calculateChange(clicksLast7Days, clicksPrevious7Days);
        const percentageChange24Hours = calculateChange(clicksLast24Hours, clicksPrevious24Hours);

        const getChangeType = (percentage) => {
            return percentage > 0 ? 'increase' : percentage < 0 ? 'decrease' : 'no change';
        };

        return res.status(200).json({
            totalClicks,
            clicksLast30Days,
            clicksLast7Days,
            clicksLast24Hours,
            changes: {
                last30Days: {
                    type: getChangeType(percentageChange30Days),
                    percentage: Math.abs(percentageChange30Days).toFixed(2)
                },
                last7Days: {
                    type: getChangeType(percentageChange7Days),
                    percentage: Math.abs(percentageChange7Days).toFixed(2)
                },
                last24Hours: {
                    type: getChangeType(percentageChange24Hours),
                    percentage: Math.abs(percentageChange24Hours).toFixed(2)
                }
            },
            monthIntervalName : last30Days.toLocaleString('default', { month: 'long', day: 'numeric' } ) + " - " + now.toLocaleString('default', { month: 'long', day: 'numeric' } ),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
};

const getLinksCreatedToday = async (req, res) => {
    try {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        const links = await Link.find({ user: req.user.id, createdAt: { $gte: last24Hours } }).countDocuments();
        return res.status(200).json({ type: "success", links });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
}

const getTop10Links = async (req, res) => {
    try {
        const links = await Link.find().sort({ totalVisits: -1 }).limit(10);
        return res.status(200).json({ type: "success", links });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
}

module.exports = { 
    getStats, 
    getStatsPremium, 
    getLinksCreatedToday,
    getTop10Links
};