const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require('morgan');
//ROUTES IMPORTS
const auth = require("./src/routes/auth");

const links = require("./src/routes/links");

const main = require("./src/routes/main");

const anonymous = require("./src/routes/anonymousLinks");

const stats = require("./src/routes/stats");
//


//MIDDLEWARES IMPORTS
const {isAuthenticated} = require("./src/middlewares/isAuthenticated");
//
app.set('trust proxy', true);
//connect middlewares
app.use(cors({
    origin:['http://localhost:4200'],
    credentials:true
    }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if(process.env.NODE_ENV === "production") {
    app.use(logger("combined"));
}else{
    app.use(logger("dev"));
}


//ROUTES
app.use("/api/v1/auth", auth);

app.use("/api/v1/links", isAuthenticated, links);

app.use("/api/v1/stats", isAuthenticated, stats);

app.use("/api/v1/anonymous", anonymous);

app.use("/", main);



app.get("/api/v1", (req, res) => {
    res.send(`Hello World !`);
});



module.exports = app;