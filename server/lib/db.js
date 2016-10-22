"use strict";

const mongoDb = require("mongodb")
const MongoClient = mongoDb.MongoClient;
const objectId = mongoDb.ObjectID;
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

          likeTweet: (tweetId, userId) => {
            let collection = db.collection("tweets");
            collection.findOne( { _id : objectId(tweetId) }, function(err, tweet) {
              if (tweet.likes.find(function (e) { return e === userId; })) {
                collection.updateOne( { _id: objectId(tweetId) }, { $pull: { likes: userId }}, function(err, added) {
                });
              } else {
                collection.updateOne( { _id: objectId(tweetId) }, { $push: { likes: userId }}, function(err, added) {
                });
              }
              console.log(tweet.likes);
              // $('*[data-customerID="22"]').children(".like-button").text(tweet.likes.length);
            });
          },

          getTweet: (tweetId, cb) => {
            let collection = db.collection("tweets");
            collection.findOne( { _id: objectId(tweetId) }, cb);
          }
        }
        onConnect(dbMethods);
      }
    })
  }
}