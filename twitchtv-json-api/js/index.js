function Stream(name) {
  // a class to represent a stream
  this.name     = name;
  this.status   = undefined;

  this.game     = "";
  this.showing  = "";

  this.logo     = "";
  this.url      = "";
}

var streamList = [
  new Stream("ESL_SC2"),
  new Stream("halo"),
  new Stream("OgamingSC2"),
  new Stream("cretetion"),
  new Stream("freecodecamp"),
  new Stream("storbeck"),
  new Stream("habathcx"),
  new Stream("RobotCaleb"),
  new Stream("noobs2ninjas"),
];

$(document).ready(setup());

function setup() {
  $("footer").css("position", "absolute");
  $(".footer-span").show();
  $("#noscript").hide();

  $(":radio").click(function() {
    radioSelection($(this).prop("id"));
  });

  streamList.forEach(function(streamer) {
    fetchStream(streamer);
  });
}

function radioSelection(choice) {
  $(".online").show();
  $(".offline").show();
  
  if (choice == "online")
    $(".offline").hide();

  if (choice == "offline")
    $(".online").hide();
}

function fetchStream(streamer) {
  var request = 'https://wind-bow.glitch.me/twitch-api/'
  request += 'streams/' + streamer.name;

  $.getJSON(request, function(response) {
    streamer.status =
      response.stream == null ? "offline" : "online";

    if (streamer.status == "online")
      extractApiData(streamer, response.stream.channel);
    else
      fetchChannel(streamer);

    $("footer").css("position","relative");
    displayStreams();
  });
}

function fetchChannel(streamer) {
  var request = 'https://wind-bow.glitch.me/twitch-api/';
  request += 'channels/' + streamer.name;

  $.getJSON(request, function(response) {
    extractApiData(streamer, response);
  
    $("footer").css("position","relative");
    displayStreams();
  });
}

function extractApiData(streamer, api) {
    streamer.name    = api.display_name;

    streamer.game    = api.game;
    streamer.showing = api.status;

    streamer.logo    = api.logo;
    streamer.url     = api.url;
}

function displayStreams() {
  var displayThis = '';

  displayThis += '<table>';

  streamList.forEach(function(stream) {
    displayThis += streamHtml(stream);
  });

  displayThis += '</table>';

  $("#stream-data").html(displayThis);
}

function streamHtml(stream) {
  var html = "";
  var logo = undefined;

  if (stream.status == undefined)
    return "";

  if (stream.logo == null)
    logo = "http://img.talkandroid.com/uploads/2014/03/Lakitu_App_Large_Icon-450x450.png";
  else
    logo = stream.logo;

  html += '<tr class="' + stream.status + '">';

  html += '<td class="left">';
  html += '<img alt="Icon" class="icon"';
  html += ' src="' + logo + '"/>';
  html += '</td>';

  html += '<td class="centre">';
  html += stream.name;
  html += '</td>';

  html += '<td class="right">';
  html += '<div class="clip">';
  if (stream.status == "online")
    html += stream.game + ": " + stream.showing;
  else
    html += "Offline";
  html += '</div>';
  html += '</td>';

  html += '</tr>';

  return html;
}