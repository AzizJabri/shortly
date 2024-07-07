const router = require("express").Router()
const {createAnonymousLink, getAnonymousLinks} = require("../controllers/links")
const {anonymousLimiter} = require("../utils/limiter")

router.post("/", anonymousLimiter, createAnonymousLink)

router.get("/", getAnonymousLinks)

module.exports = router