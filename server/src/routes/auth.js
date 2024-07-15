const router = require("express").Router()
const {login, register, verify, me, refreshToken} = require("../auth/user")
const {isAuthenticated} = require("../middlewares/isAuthenticated")

router.post("/login",login)

router.get("/login", (req, res) => {
    res.send({
        type : "error",
        message : `This route is not supported. Please use POST ${req.baseUrl+req.path}`
    });
});

router.post("/register", register)

router.get("/register", (req, res) => {
    res.send({
        type : "error",
        message : `This route is not supported. Please use POST ${req.baseUrl+req.path}`
    });
});

router.post("/verify", verify)

router.get("/verify", (req, res) => {
    res.send({
        type : "error",
        message : `This route is not supported. Please use POST ${req.baseUrl+req.path}`
    });
});

router.get("/me", isAuthenticated, me)

router.post("/me", (req, res) => {
    res.send({
        type : "error",
        message : `This route is not supported. Please use POST ${req.baseUrl+req.path}`
    });
});

router.post("/refresh", refreshToken)

router.get("/refresh", (req, res) => {
    res.send({
        type : "error",
        message : `This route is not supported. Please use POST ${req.baseUrl+req.path}`
    });
});



module.exports = router