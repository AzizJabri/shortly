const router = require("express").Router()
const {createLink, getLinks, deleteLink } = require("../controllers/links")
const {limiter} = require("../utils/limiter")

router.post("/", limiter, createLink)

router.get("/", getLinks)

router.delete("/:id", deleteLink)

module.exports = router