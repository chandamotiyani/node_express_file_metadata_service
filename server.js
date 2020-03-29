"use strict";

var express = require("express");
var cors = require("cors");
var busboy = require("connect-busboy"); //middleware for form/file upload
//var bodyParser = require("body-parser"); //connects bodyParsing middleware

// require and use "multer"...

var app = express();
app.use(cors());
app.use(busboy());
//app.use(bodyParser({ defer: true }));

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/hello", function (req, res) {
    res.json({greetings: "Hello, API"});
});

/* This service will retrive the uploaded file and to do so will use the busboy package */

app.post("/api/fileanalyse", busboy({immediate: true}), function (
        req,
        res,
        next
        ) {
    var fileData = {};
    req.pipe(req.busboy); // Pipe it trough busboy
    req.busboy.on("field", function (fieldname, val) {
        fileData[fieldname] = val;
    });

    req.busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
        fileData['filename'] = filename;
        fileData['type'] = mimetype;
        fileData['size'] = req.headers['content-length'];
        file.resume();
    });

    req.busboy.on("finish", function () {
        res.json({name: fileData['filename'], type: fileData['type'], size: fileData['size']});
    });

});

app.listen(process.env.PORT || 3000, function () {
    console.log("Node.js listening ...");
});
