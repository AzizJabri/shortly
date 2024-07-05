const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const audit = require("express-requests-logger");


//ROUTES IMPORTS
const auth = require("./src/routes/auth");

const links = require("./src/routes/links");

const main = require("./src/routes/main");
//


//MIDDLEWARES IMPORTS
const {isAuthenticated} = require("./src/middlewares/isAuthenticated");
//

//connect middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if(process.env.NODE_ENV === "production") {
    app.use(audit({logger: console}));
}


//ROUTES
app.use("/api/v1/auth", auth);

app.use("/api/v1/links", isAuthenticated, links);

app.use("/", main);



app.get("/api/v1", (req, res) => {
    res.send(`Hello World !`);
});



module.exports = app;