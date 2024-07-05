const router = require("express").Router()
const { visitLink} = require("../controllers/links")


router.get("/:id", visitLink)

module.exports = router