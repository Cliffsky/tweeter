$(function () {
  $(".new-tweet").on("input", "textarea", function (e) {
    var counter = 140 - $(this).val().length;
    $(".new-tweet .counter").text(counter);
    if (counter < 0) {
      $(".new-tweet .counter").css("color", "red");
    } else {
      $(".new-tweet .counter").removeAttr('style');
    }
  });
});