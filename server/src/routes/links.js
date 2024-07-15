const router = require("express").Router()
const {createLink, getLinks, deleteLink, getLink, updateLink } = require("../controllers/links")
const {limiter} = require("../utils/limiter")

router.post("/", limiter, createLink)

router.get("/", getLinks)

router.delete("/:id", deleteLink)

router.get("/:id", getLink)

router.patch("/:id", updateLink)

module.exports = router