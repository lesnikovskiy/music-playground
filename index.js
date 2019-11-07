const connect = require('connect');
const serveStatic = require('serve-static');
const fs = require('fs');
const https = require("https");

const options = {
    key: fs.readFileSync("./m3scert.pem"),
    cert: fs.readFileSync("./m3scert.pem")
};

const app = connect().use(serveStatic(__dirname));

https.createServer(options, app).listen(3000, () => console.log("Server running on 3000"));
