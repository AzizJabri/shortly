const router = require("express").Router()
const {createLink, getLinks, deleteLink, getLink, updateLink, generateQRCode } = require("../controllers/links")
const { isPremium } = require("../middlewares/isPremium")
const {limiter} = require("../utils/limiter")

router.post("/", limiter, createLink)

router.get("/", getLinks)

router.delete("/:id", deleteLink)

router.get("/:id", getLink)

router.patch("/:id", updateLink)

router.get("/:id/qr", isPremium, generateQRCode)

module.exports = router