const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');

if(!process.env.DBHOST) {
    throw new Error("Please specify the databse host using environment variable DBHOST.");
}

if (!process.env.DBNAME) {
    throw new Error("Please specify the name of the database using environment variable DBNAME");
}

const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

function connectDb() {
    return mongodb.connect(DBHOST)
        .then(client => {
            return client.db(DBNAME);
        });
}

function setupHanders(app, db) {
    const videosCollection = db.collection("videos");

    app.post("/viewed", (req, res) => {
        const videoPath = req.body.videoPath;
        videosCollection
            .insertOne({videoPath: videoPath})
            .then(() => {
                console.log(`Added video ${videoPath} to history`);
                res.sendStatus(200);
            })
            .catch(err => {
                console.error(`Error adding video ${videoPath} to history`);
                console.error(err && err.stack || err);
                res.sendStatus(500);
            });
        
    });

    app.get("/history", (req, res) => {
        const skip = parseInt(req.query.skip);
        const limit =parseInt(req.query.limit);

        videosCollection.find()
            .skip(skip)
            .limit(limit)
            .toArray()
            .then(documents => {
                res.json({history: documents})
            })
            .catch(err => {
                console.error(`Error retrieving history from database.`);
                console.error(err && err.stack || err);
                res.sendStatus(500);
            });
    });
}

function startHttpServer(db) {
    return new Promise(resolve => {
        const app = express();
        app.use(bodyParser.json());
        setupHanders(app, db);

        const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
        app.listen(port, () => {
            resolve();
        });
    });
}

function main() {
    return connectDb(DBHOST)
        .then(db => {
            return startHttpServer(db);
        })
}

main()
    .then(() => console.log("Microservice online."))
    .catch(err => {
        console.error("Microservice failed to start.");
        console.error(err && err.stack || err);
    });