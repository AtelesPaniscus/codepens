var getNewQuote = undefined;

$(document).ready(function() {
  $("footer").css("position", "absolute");
  $(".footer-span").show();
  $("#noscript").hide();

  $("#quote-button").click(function(){quote()});

  quote();
});

function quote() {
  if (getNewQuote == undefined) {
    // find one that works by trying them all
    requestWebMaker();
    requestBrowser();
    requestCodePen();
    requestCrossOrigin();
    return;
  }

  $.getJSON(getNewQuote, function(json) {
    displayQuote(json);
    setTweetUrl(json);
  });
}

function requestWebMaker() {
  // this simple solution works in Web Maker
  var request = '';

  request += 'http://api.forismatic.com/api/1.0/';
  request += '?method=getQuote';
  request += '&lang=en';
  request += '&format=json';
  
  tryRequest(request);
}

function requestBrowser() {
  // this works in real browsers
  var request = '';

  request += 'http://api.forismatic.com/api/1.0/';
  request += '?method=getQuote';
  request += '&lang=en';
  request += '&format=jsonp&jsonp=?';

  tryRequest(request);
}

function requestCodePen() {
  // this CORS solution works in CodePen
  var request = '';

  request += 'https://cors-anywhere.herokuapp.com/';
  request += 'http://api.forismatic.com/api/1.0/';
  request += '?method=getQuote';
  request += '&lang=en';
  request += '&format=json';

  tryRequest(request);
}

function requestCrossOrigin() {
  // this recommended solution does not work anywhere
  var request = '';

  request += 'https://crossorigin.me/';
  request += 'http://api.forismatic.com/api/1.0/';
  request += '?method=getQuote';
  request += '&lang=en';
  request += '&format=json';

  tryRequest(request);
}

function tryRequest(request) {
  $.getJSON(request, function(json) {
    if (getNewQuote == undefined) {
      getNewQuote = request;
      displayQuote(json);
      setTweetUrl(json);
    }
  });
}

function displayQuote(response) {
  if (response.quoteAuthor != "")
    $("#author").html("- " + response.quoteAuthor);
  else
    $("#author").html("- " + "Anonymous");

  var quote = "<q>" + response.quoteText.trim() + "</q>";
  $("#quote").html(quote);
}

function setTweetUrl(response) {
  var tweetUrl = 'https://twitter.com/intent/tweet';
  tweetUrl += '?hashtags=quotes';
  tweetUrl += '&related=freecodecamp';
  tweetUrl += '&text="' + response.quoteText + '"';
  tweetUrl += ' ' + response.quoteAuthor;
  
  $("#tweet-url").attr("href", tweetUrl);
  $("#tweet-button").show();
  $("#quote-button").css("float", "left");
}