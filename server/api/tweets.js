"use strict";

const User    = require("../lib/user-helper")
const express = require('express');
const tweets  = express.Router();

module.exports = function(db) {

  tweets.get("/", function(req, res) {
    db.getTweets(function (tweets) {
      res.send(tweets);
    });
  });

  tweets.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400);
      return res.send("{'error': 'invalid request'}\n");
    }

    const user = req.body.user ? req.body.user : User.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      likes: [],
      created_at: Date.now()
    };
    db.saveTweet(tweet);
    return res.send();
  });

  tweets.put("/:id", function(req, res) {
    db.likeTweet(req.params.id, req.connection.remoteAddress);
    return res.send();
  })

  tweets.get("/:id", function(req, res) {
    db.getTweet(req.params.id, function (err, tweet) {
      console.log(JSON.stringify(tweet.likes.length));
      res.send(JSON.stringify(tweet.likes.length));
    })
  })

  return tweets;
}
