const router = require("express").Router()
const { getStats, getStatsPremium, getLinksCreatedToday, getTop10Links } = require("../controllers/stats")
const { isPremium } = require("../middlewares/isPremium")


router.get("/", getStats)

router.get("/premium", isPremium, getStatsPremium)

router.get("/today", getLinksCreatedToday)

router.get("/top", getTop10Links)


module.exports = router