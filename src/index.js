//src: https://github.com/bootstrapping-microservices

const express = require('express');
const fs = require('fs');

const app = express();

// if(!process.env.PORT) {
//     throw new Error("Please specify the port number for the HTTP server with the environemnt variable PORT.");
// }

// const port = process.env.PORT;
const port = 3000;

app.get("/", (req, res) => {
    res.send('Hello World!\n');
});

app.get("/video", (req, res) => {

     //
    // Original video from here:
    // https://sample-videos.com
    //
    const path = "videos/SampleVideo_1280x720_1mb.mp4";
    fs.stat(path, (err, stats) => {
        if(err) {
            console.error(`An error occurred\n${err}`);
            res.sendStatus(500);
            return;
        } 

        res.writeHead(200, {
           "Content-Length": stats.size,
           "Content-Type": "video/mp4", 
        });

        fs.createReadStream(path).pipe(res);
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});