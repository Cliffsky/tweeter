$(function() {

  function renderTweets(tweetData) {
    $('article.tweet').remove();
    // tweetData.reverse().forEach((tweet) => {
    //   $('.container').after(".new-tweet").append(createTweetElement(tweet));
    // })

    var tweets = tweetData.reverse().map(createTweetElement);
    $('.container').append(tweets);
  }

  window.loadTweets = loadTweets;

  function loadTweets() {
    $.ajax({
      method: 'GET',
      url: '/tweets',
      success: renderTweets
    });

    // $.get('/tweets').then(renderTweets);
  }
  loadTweets();

  function createTweetElement(tweet) {
    var $tweet = $("<article>").addClass("tweet");
    var header = $("<header>")
    var avatar = $("<img>").attr("src", tweet.user.avatars.small);
    var username = $("<h2>").addClass("user-name").text(tweet.user.name);
    var handle = $("<span>").addClass("user-id").text(tweet.user.handle);

    var footer = $("<footer>");
    var time = $("<span>").text(classifyTime(tweet.created_at));
    var fa = $("<div>").addClass("icons");
    var icons = [
      $("<i>").addClass("fa fa-flag"),
      $("<i>").addClass("fa fa-heart"),
      $("<i>").addClass("fa fa-retweet")
    ]

    fa.append(icons[0]).append(icons[1]).append(icons[2]);
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
});