"use strict";

const mongoDb = require("mongodb");
const MongoClient = mongoDb.MongoClient;
const objectId = mongoDb.ObjectID;
const MONGODB_URI = "mongodb://127.0.0.1:27017/tweeter";

console.log(`Connecting to MongoDB running at: ${MONGODB_URI}`);

MongoClient.connect(MONGODB_URI, (err, db) => {

  if (err) {
    console.log('Could not connect! Unexpected error. Details below.');
    throw err;
  }

  console.log('Connected to the database!');
  let collection = db.collection("tweets");

  function likeTweet (tweetId, userId) {
    // let collection = db.collection("tweets");
    collection.findOne( { _id : objectId(tweetId) }, function(err, tweet) {
      if (tweet.likes.find(function (e) { return e === userId; })) {
        collection.updateOne( { _id: objectId(tweetId) }, { $pull: { likes: userId }}, function(err, added) {
        });
      } else {
        collection.updateOne( { _id: objectId(tweetId) }, { $push: { likes: userId }}, function(err, added) {
        });
      }
    });
  }

  likeTweet ("580a7f4cbdb3511dd6561dd4", '::ffff:10.0.2.2');

  console.log('Retrieving documents for the "tweets" collection...');
  collection.find().toArray((err, results) => {
    console.log('results: ', results);

    console.log('Disconnecting from Mongo!');
    db.close();
  });
});