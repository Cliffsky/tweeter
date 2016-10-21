"use strict";

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/tweeter";


module.exports = {

  connect: function (onConnect) {
    MongoClient.connect(MONGODB_URI, (err, db) => {
      if (err) {
        throw err;
      } else {
        const dbMethods = {
          saveTweet: (data) => {
            let collection = db.collection("tweets");
            collection.insertOne(data);
          },

          getTweets: (cb) => {
            let collection = db.collection("tweets");
            collection.find().toArray((err, tweets) => {
              cb(tweets);
            })
          },

          likeTweet: (tweetId, status) => {
            let collection = db.collection("tweets");
            if (status) {
              collection.update(
                { _id: tweetId },
                { $inc: { likes: -1 } }
              );
            } else {
              collection.update(
                { _id: tweetId },
                { $inc: { likes: +1 } }
              );
            }
          }
        }
        onConnect(dbMethods);
      }
    })
  }
}