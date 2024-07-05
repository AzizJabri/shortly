const router = require("express").Router()
const {createLink, getLinks, deleteLink} = require("../controllers/links")

router.post("/", createLink)

router.get("/", getLinks)

router.delete("/:id", deleteLink)

module.exports = router