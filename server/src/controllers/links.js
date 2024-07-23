const Link = require('../models/Link')
const Click = require('../models/Click')
const AnonymousLink = require('../models/AnonymousLink');
const {generateUrl} = require('../utils/urlUtils');
const uuid = require('uuid');
const QRCode = require('qrcode');
const {CLIENT_URL} = require("../configs");

const createLink = async (req, res) => {
    try {

        const linksLast24Hours = await Link.find({ user: req.user._id, createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
        console.log(linksLast24Hours.length, req.user.plan)
        if (linksLast24Hours.length >= 5 && req.user.plan != "premium") {
            return res.status(400).json({ type: "error", message: "You can only create 5 links per day, Upgrade to premium to unlock unlimited links!" });
        }

        const { title, long_url } = req.body;
        if (!title || !long_url) {
            return res.status(400).json({ type: "error", message: "Title and URL are required" });
        }
        const generateUniqueUrl = async () => {
            let short_url;
            let existingLink;
            do {
                short_url = generateUrl(6);
                existingLink = await Link.findOne({ short_url });
            } while (existingLink);
            return short_url;
        };

        const short_url = await generateUniqueUrl();

        const newLink = new Link({
            title,
            long_url,
            short_url,
            user: req.user._id
        });

        await newLink.save();
        return res.status(201).json({ type: "success", message: "Link created successfully", link: newLink });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
}

const createAnonymousLink = async (req, res) => {
    try {
        const { long_url } = req.body;
        if (!long_url) {
            return res.status(400).json({ type: "error", message: "URL is required" });
        }

        var session_id;
        try{
            session_id = req.headers.cookie.split(";").find(c => c.includes("session")).split('=')[1];
            const anonymousLinks = await AnonymousLink.find({ session: session_id });
            if(anonymousLinks.length >= 1){
                return res.status(400).json({ type: "error", message: "You can only create 1 anonymous link per session, create an account to upgrade" });
            }
        }catch{
            session_id = uuid.v4();
        }

        const generateUniqueUrl = async () => {
            let short_url;
            let existingLink;
            do {
                short_url = generateUrl(6);
                existingLink = await AnonymousLink.findOne({ short_url }) || await Link.findOne({ short_url });
            } while (existingLink);
            return short_url;
        };

        const short_url = await generateUniqueUrl();
        

        const newLink = new AnonymousLink({
            long_url,
            short_url,
            session: session_id
        });
        res.cookie('session', session_id, { maxAge: 86400000, httpOnly: true });
        await newLink.save();
        return res.status(201).json({ type: "success", message: "Link created successfully", link: newLink });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
}

const getLinks = async (req, res) => {
    try {
        const { search = "", page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Find all links for the user
        const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 });

        // Filter links based on the search query
        const filteredLinks = links.filter(link => link.title.toLowerCase().includes(search.toLowerCase()));

        // Calculate pagination details
        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = pageNumber * limitNumber;
        const paginatedLinks = filteredLinks.slice(startIndex, endIndex);

        return res.status(200).json({ 
            type: "success", 
            links: paginatedLinks,
            currentPage: pageNumber,
            totalPages: Math.ceil(filteredLinks.length / limitNumber),
            totalLinks: filteredLinks.length
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
};

const getLink = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ type: "error", message: "ID is required" });
        }
        const link = await Link.findOne({ short_url: id, user: req.user.id });
        if (!link) {
            return res.status(404).json({ type: "error", message: "Link not found" });
        }
        return res.status(200).json({ type: "success", link });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
}

const updateLink = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ type: "error", message: "ID is required" });
        }
        const link = await Link.findOne({ short_url: id, user: req.user.id });
        if (!link) {
            return res.status(404).json({ type: "error", message: "Link not found" });
        }
        const { title, long_url } = req.body;
        if (!title || !long_url) {
            return res.status(400).json({ type: "error", message: "Title and URL are required" });
        }
        link.title = title;
        link.long_url = long_url;
        await link.save();
        return res.status(200).json({ type: "success", message: "Link updated successfully", link });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
}

const getAnonymousLinks = async (req, res) => {
    try {
        let session_id;
        try{
            session_id = req.headers.cookie.split(";").find(c => c.includes("session")).split('=')[1];
        }catch{
            return res.status(200).json({ type: "success", links: [] });
        }
        let links = await AnonymousLink.find({ session: session_id });
        links.forEach(link => link.ip = undefined);
        return res.status(200).json({ type: "success", links });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
}

const deleteLink = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ type: "error", message: "ID is required" });
        }
        const link = await Link.findOneAndDelete({ short_url: id, user: req.user.id });
        if (!link) {
            return res.status(404).json({ type: "error", message: "Link not found" });
        }
        return res.status(200).json({ type: "success", message: "Link deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
}

const visitLink = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ type: "error", message: "ID is required" });
        }
        const link = await Link.findOne({ short_url: id }) || await AnonymousLink.findOne({ short_url: id });
        if (!link) {
            return res.status(404).json({ type: "error", message: "Link not found" });
        }
        //increment totalVisits if link is not anonymous
        if (link instanceof Link) {
            link.totalVisits++;
            await link.save();
        }

        const newClick = new Click({
            link: link._id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            referer: req.headers['referer'] || "Direct",
            platform: req.headers['sec-ch-ua-platform'] || "Unknown",
        });
        await newClick.save();
        return res.redirect(link.long_url);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
}

const generateQRCode = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ type: "error", message: "ID is required" });
        }
        const link = await Link.findOne({ short_url: id });
        if (!link) {
            return res.status(404).json({ type: "error", message: "Link not found" });
        }
        const qrCode = await QRCode.toDataURL(`${req.headers.host}/${link.short_url}`);
        return res.status(200).json({ type: "success", qrCode });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
}



module.exports = {
    createLink,
    getLinks,
    deleteLink,
    visitLink,
    createAnonymousLink,
    getAnonymousLinks,
    getLink,
    updateLink,
    generateQRCode
}