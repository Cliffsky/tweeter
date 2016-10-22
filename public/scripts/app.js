$(function() {

  function renderTweets(tweetData) {
    $('article.tweet').remove();


    var tweets = tweetData.reverse().map(createTweetElement);
    $('.container').append(tweets);
    tweetData.forEach(function (tweet) {
      $.ajax({
        method: 'GET',
        url: `/tweets/${tweet._id}`,
        success: function (res) {
          updateCount(res, tweet._id);
        }
      })
    })
  }

  window.loadTweets = loadTweets;

  function loadTweets() {
    $.ajax({
      method: 'GET',
      url: '/tweets',
      success: renderTweets
    });
  }
  loadTweets();

  function updateCount (res, id) {
    let count = JSON.parse(res);
    count = count ? count : '';
    $(`*[data-id="${id}"]`).find(".like-counter").text(count);
  }


  function createTweetElement(tweet) {
    var $tweet = $("<article>").addClass("tweet").attr("data-id", tweet._id);
    var header = $("<header>");
    var avatar = $("<img>").attr("src", tweet.user.avatars.small);
    var username = $("<h2>").addClass("user-name").text(tweet.user.name);
    var handle = $("<span>").addClass("user-id").text(tweet.user.handle);

    var footer = $("<footer>");
    var time = $("<span>").text(classifyTime(tweet.created_at));
    var fa = $("<div>").addClass("icons");
    var icons = [
      $("<i>").addClass("fa fa-flag"),
      $("<i>").addClass("fa fa-heart").addClass("like-button"),
      $("<span>").addClass("like-counter"),
      $("<i>").addClass("fa fa-retweet")
    ]
    icons.forEach(function (icon) {
      fa.append(icon);
    })
    header.append(avatar).append(username).append(handle);
    footer.append(time).append(fa);
    $tweet.append(header);
    $tweet.append($("<div>").addClass("content").text(tweet.content.text));
    $tweet.append(footer);

    return $tweet;
  }

  function classifyTime (time) {
    var ago = Date.now() - time;
    var timeMessage = "";
    if ((ago / 86400000) >= 1) {
      timeMessage = Math.floor(ago / 86400000) + " days ago."
    } else if ((ago / 3600000) >= 1) {
      timeMessage = Math.floor(ago / 3600000) + " hours ago."
    } else if ((ago / 60000) >= 1) {
      timeMessage = Math.floor(ago / 60000) + " minutes ago."
    } else {
      timeMessage = "Just now."
    }
    return timeMessage;
  }

  // script for index.html
  $("form").on('submit', function (event) {
    var $textarea = $(this).children("textarea");
    event.preventDefault();
    var tweet = $textarea.serialize();
    if (tweet !== 'text=' && tweet.length <= 145) {
      $.ajax({
        method: 'POST',
        url: '/tweets/',
        data: tweet,
        success: function () {
          $textarea.val("").attr("placeholder", "What are you humming about?");
          $(".new-tweet .counter").text(140);
          loadTweets();
        }
      })
    } else if (tweet.length > 145) {
      window.alert("Chill out! 140 or Less!");
    } else {
      window.alert("Type in some words!");
    }
  });

  $(".toggle").on('click', function(event) {
    $(".new-tweet").slideToggle(255);
    if ($(".new-tweet textarea").data('inputFocused')) {
        $(".new-tweet textarea").blur();
    } else {
        setTimeout(function () {
          $(".new-tweet textarea").focus();
        }, 255);
    };
  });

  $("body").on('click', function(event) {
    if ($(".login-bar").is(":visible")) {
      $(".login-bar").slideUp();
    }
  })

  $(".login").on('click', function(event) {
    event.stopPropagation();
    $(".login-bar").slideToggle(255);
    if ($(".login-bar input").data('inputFocused')) {
        $(".login-bar input").blur();
    } else {
        setTimeout(function () {
          $(".login-bar input").focus();
        }, 255);
    };
  })

  $("body").on('click', '.like-button', function(event) {
    var id = $(this).parents("article").data("id");
    var liked = $(this).data("liked");
    $.ajax({
      method: 'PUT',
      url: `/tweets/${id}`,
      data: { liked },
      success: function () {
        $.ajax({
          method: 'GET',
          url: `/tweets/${id}`,
          success: function (res) {
            updateCount(res, id);
          }
        })
      },
      error: function(req, err) {
      }
    })
  })

});
