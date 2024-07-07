const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const audit = require("express-requests-logger");
//ROUTES IMPORTS
const auth = require("./src/routes/auth");

const links = require("./src/routes/links");

const main = require("./src/routes/main");

const anonymous = require("./src/routes/anonymousLinks");
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
    app.use(audit({
        logger: logger, // Existing bunyan logger
        excludeURLs: ['health', 'metrics'], // Exclude paths which enclude 'health' & 'metrics'
        request: {
            maskBody: ['password'], // Mask 'password' field in incoming requests
            excludeHeaders: ['authorization'], // Exclude 'authorization' header from requests
            excludeBody: ['creditCard'], // Exclude 'creditCard' field from requests body
            maskHeaders: ['header1'], // Mask 'header1' header in incoming requests
            maxBodyLength: 50 // limit length to 50 chars + '...'
        },
        response: {
            maskBody: ['session_token'], // Mask 'session_token' field in response body
            excludeHeaders: ['*'], // Exclude all headers from responses,
            excludeBody: ['*'], // Exclude all body from responses
            maskHeaders: ['header1'], // Mask 'header1' header in incoming requests
            maxBodyLength: 50 // limit length to 50 chars + '...'
        },
        shouldSkipAuditFunc: function(req, res){
            // Custom logic here.. i.e: return res.statusCode === 200
            return false;
        }
    }));
}


//ROUTES
app.use("/api/v1/auth", auth);

app.use("/api/v1/links", isAuthenticated, links);

app.use("/api/v1/anonymous", anonymous);

app.use("/", main);



app.get("/api/v1", (req, res) => {
    res.send(`Hello World !`);
});



module.exports = app;