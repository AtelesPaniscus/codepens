// a class to represent the pomodoro clock

function Pomodoro() {

  this.period   = undefined;
  this.colour   = undefined;
  this.timeToGo = undefined;
  this.timerId  = undefined;

  this.start = function(timePeriod, fillColour) {
    this.pause();

    this.period = timePeriod;
    this.colour = fillColour;

    $("#clock-ring").css("border-color",fillColour);

    this.timeToGo = this.period * 60;

    this.resume();
    this.update();
  }

  this.adjustTimeToGo = function(adjustBy) {
    var newTime = this.timeToGo + adjustBy * 60 + 59;

    this.timeToGo = Math.floor(newTime / 60) * 60;
    this.update();
    this.timeToGo += 1;
  }

  this.processEvent = function(clickEvent) {
    if (clickEvent != undefined)
      if (clickEvent.target.tagName == "BUTTON")
        return false;

    if (this.timerId != undefined)
      clearInterval(this.timerId);
    this.timerId = undefined;

    return true;
  }

  this.pause = function(click) {
    if (this.processEvent(click)) {
      $("#page").click(
        function(event) { pomodoro.resume(event); });
    }
  }

  this.resume = function(click) {
    if (this.processEvent(click)) {
      $("#page").click(
        function(event) { pomodoro.pause(event); });

      this.timerId = setInterval(
        function() { pomodoro.tick(); }, 1000);
    }
  }

  this.tick = function() {
    this.timeToGo -= 1;

    if (this.timeToGo > 0)
      this.update();
    else
      currentInterval.end();
  }

  this.update = function() {
    var minutes = Math.floor(this.timeToGo / 60);
    var seconds = this.timeToGo % 60;

    if (seconds < 10)
      $("#timeToGo").html(minutes + ':0' + seconds);
    else
      $("#timeToGo").html(minutes + ':' + seconds);

    seconds = this.period * 60;

    var done = (seconds - this.timeToGo) * 100 / seconds;

    var fill = "linear-gradient(to top, ";
    fill += this.colour + " " + done + "%, ";
    fill += "transparent " + done + "%)";

    $("#clock-area").css("background",fill);
  }
}

var pomodoro = new Pomodoro();

// a class to represent the session and break intervals

var server = "https://github.com/AtelesPaniscus/fcc-fed-codepens/blob/master/sounds/";

function Interval(length, id, colour, text, fanfare, attribution) {
  this.minutesLength = length;
  this.displayId     = id;
  this.fillColour    = colour;
  this.bannerText    = text;
  this.attribution   = fanfare + ", " + attribution;
  this.nextInterval  = undefined;
  this.timeId        = undefined;

  this.fanfare       = new Audio(
    server + fanfare + "?raw=true");

  this.adjustLength = function(by) {
    this.minutesLength += by;
    this.displayLength();
  }

  this.displayLength = function() {
    if (this.minutesLength < 10)
      $(this.displayId).html("&nbsp;" + this.minutesLength);
    else
      $(this.displayId).html(this.minutesLength);
  }

  this.start = function() {
    $("#session").html(this.bannerText)
      .prop("title", this.attribution);

    currentInterval = this;
    pomodoro.start(this.minutesLength, this.fillColour);
  }

  this.end = function() {
    this.fanfareStart();

    this.nextInterval.start();
  }

  this.fanfareStart = function() {
    if (this.timerId != undefined)
      clearInterval(this.timerId);
    this.timerId = setInterval(
        function() {
          currentInterval.nextInterval.fanfareStop();
        }, 4000);

    this.fanfare.play();
  }

  this.fanfareStop = function() {
    if (this.timerId != undefined)
      clearInterval(this.timerId);
    this.timerId = undefined;

    this.fanfare.pause();
    this.fanfare.currentTime = 0;
  }
}

var sessionInterval = new Interval(
  25, "#session-length",  "green",  "Session",
  "Bicycle-Bell.mp3",
  "Recorded by Mike Koenig, Attribution 3.0");

var breakInterval   = new Interval(
  5,  "#break-length",    "red",   "¡ Break !",
  "Sleigh-Bells.mp3",
  "Personal Use Only");

var currentInterval = undefined;

// setup and run

$(document).ready(setup());

function setup() {
  $("footer").css("position", "absolute");
  $(".footer-span").show();
  $("#noscript").hide();

  $("#goto-start").click(function() {
    currentInterval.start();
  });
  $("#goto-end").click(function() {
    currentInterval.nextInterval.start();
  });

  $("#backwards").click(function() {
    pomodoro.adjustTimeToGo(+1);
  });
  $("#forwards").click(function() {
    pomodoro.adjustTimeToGo(-1);
  });

  $("#decr-break").click(function() {
    breakInterval.adjustLength(-1);
  });
  $("#incr-break").click(function() {
    breakInterval.adjustLength(+1);
  });

  $("#decr-session").click(function() {
    sessionInterval.adjustLength(-1);
  });
  $("#incr-session").click(function(){
    sessionInterval.adjustLength(+1);
  });

  sessionInterval.nextInterval = breakInterval;
  breakInterval.nextInterval = sessionInterval;

  sessionInterval.displayLength();
  breakInterval.displayLength();

  sessionInterval.start();
  pomodoro.pause();
}