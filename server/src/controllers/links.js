const Link = require('../models/Link');
const {generateUrl} = require('../utils/urlUtils');

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

const getLinks = async (req, res) => {
    try {
        const links = await Link.find({ user: req.user.id });
        return res.status(200).json({ type: "success", links });
    } catch (error) {
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
        const link = await Link.findOne({ short_url: id });
        if (!link) {
            return res.status(404).json({ type: "error", message: "Link not found" });
        }
        link.totalVisits += 1;
        await link.save();
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
    visitLink
}