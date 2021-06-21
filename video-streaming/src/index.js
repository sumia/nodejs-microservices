//src: https://github.com/bootstrapping-microservices

const express = require('express');
const http = require('http');

const app = express();

if(!process.env.PORT) {
    throw new Error("Please specify the port number for the HTTP server with the environemnt variable PORT.");
}

const port = process.env.PORT;
const VIDEO_STORAGE_HOST= process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT);

app.get("/", (req, res) => {
    res.send('Hello World!\n');
});

app.get("/video", (req, res) => {
    const forwardRequest = http.request({
        host: VIDEO_STORAGE_HOST,
        port: VIDEO_STORAGE_PORT,
        path: "/video?path=SampleVideo_1280x720_1mb.mp4",
        method: "GET",
        headers: req.headers
    },
    forwardResponse => {
        res.writeHeader(forwardResponse.statusCode, forwardResponse.headers);
        forwardResponse.pipe(res);
    });

    req.pipe(forwardRequest);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});