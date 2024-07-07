const Link = require('../models/Link')
const Click = require('../models/Click')
const AnonymousLink = require('../models/AnonymousLink');
const {generateUrl} = require('../utils/urlUtils');
const uuid = require('uuid');

const createLink = async (req, res) => {
    try {
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
        var session_id;
        try{
            session_id = req.headers.cookie.split('=')[1];
        }catch{
            session_id = uuid.v4();
        }

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
        const links = await Link.find({ user: req.user.id });
        return res.status(200).json({ type: "success", links });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal server error" });
    }
}

const getAnonymousLinks = async (req, res) => {
    try {
        let session_id;
        try{
            session_id = req.headers.cookie.split('=')[1] || req.query.session;
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

module.exports = {
    createLink,
    getLinks,
    deleteLink,
    visitLink,
    createAnonymousLink,
    getAnonymousLinks
}