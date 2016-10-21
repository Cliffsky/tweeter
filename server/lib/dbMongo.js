"use strict";

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/tweeter";

MongoClient.connect(MONGODB_URI, (err, db) => {

let tweets = db.collection("tweets");

  if (err) {
    console.log('Could not connect! Unexpected error. Details below.');
    throw err;
  }

  const dbMethods = {

    saveTweet: (data) => {
      tweets.insertOne(data);
      return true;
    },

    getTweets: () => {
      return tweets.find().toArray.sort(function(a, b) { return a.created_at - b.created_at });
    }

  }

  db.close();
});

function getATweet(cb) {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    let tweets = db.collection("tweets");
    let results = tweets.find().toArray();
    cb(results);
    db.close();
  })
}

module.exports = {

  // connect: (onConnect) => {

  //   onConnect(dbMethods);

  // },

  getATweet: getATweet,

}
