var on = false;
var strictMode = false;
var simonsList = [];
var simonsCount = undefined;
var usersTurn = false;
var usersCount = undefined;
var timerId = undefined;

//$(document).ready(setup());
document.onreadystatechange = function () {
  if (document.readyState === 'complete')
    setup();
};

function setup() {
  drawSegments();
  
  $("footer").css("position", "absolute");
  $(".footer-span").show();
  $("#noscript").hide();

  $("#switch-on").click(function() {
    switchOn(true);
  });

  $("#switch-off").click(function() {
    switchOn(false);
  });

  $("#strict-button").click(function() {
    setStrict(!strictMode);
  });

  $("#start-button").click(function() {
    $("#strict-button").prop("disabled", true);

    playRound(true);
  });

  $(".segment").mousedown(function() {
    if (usersTurn) {
      var id = $(this).attr("id");
      var nn = Number(id.slice(-1));

      segmentSelect(nn);
    }
  });

  $(".segment").mouseup(function() {
    if (usersTurn) {
      var id = $(this).attr("id");
      var nn = Number(id.slice(-1));

      segmentDeselect(nn);

      userPress(nn);
    }
  });

  switchOn(false);
}

function switchOn(state) {
  setClearCallbackup();

  [1, 2, 3, 4].forEach(
    function (nn) { segmentDeselect(nn); });
  setStrict(false);

  on = state;
  usersTurn = false;

  $("button").prop("disabled", true);
  $(".onoff").prop("disabled", false);
  $(".segment").removeClass("button");
  $("#count").css("text-decoration", "none");

  if (on) {
    $("#count").html("--");
    $("#switch-on").css("background-color", "blue");
    $("#switch-off").css("background-color", "black");
    $("#start-button").prop("disabled", false);
    $("#strict-button").prop("disabled", false);
  }
  else {
    $("#count").html("&nbsp;");
    $("#switch-on").css("background-color", "black");
    $("#switch-off").css("background-color", "blue");
  }
}

function setStrict(state) {
  strictMode = state;

  if (strictMode)
    $("#led").css("background-color", "red");
  else
    $("#led").css("background-color", "black");

  if (strictMode)
    $("#count").prop("title", "Simon's a computer, Simon has a brain, you either do what Simon says or else go down the drain!");
  else
    $("#count").prop("title", "");
}

function playRound(newSequence)
{
  $("#count").css("text-decoration", "none");

  if (newSequence) {
    simonsList = [0];

    for (var ii = 0; ii < 20; ++ii)
      simonsList.push(Math.floor((Math.random() * 4)) + 1);

    simonsCount = 1;
  }

  usersTurn = false;
  simonsPress(1);
}

function simonsPress(nn) {
  setClearCallbackup(function() {
    simonsPressEnd(nn); }, simonsCount < 11 ? 500 : 250);

  segmentSelect(simonsList[nn]);

  $("#count").html(nn < 10 ? "0" + nn : nn);
}

function simonsPressEnd(nn) {
  setClearCallbackup(function() {
    nextStep(nn + 1); }, 250);

  segmentDeselect(simonsList[nn]);
}

function nextStep(nn) {
  setClearCallbackup();

  if (nn <= simonsCount)
    simonsPress(nn);
  else
    usersTurnStart();
}

function usersTurnStart() {
  $(".segment").addClass("button");

  usersTurn = true;

  $("#count").html("00");

  waitForUserPress(1);
}

function waitForUserPress(nn) {
  setClearCallbackup(function() {
    usersTurnEndsWell(false); }, 5000);

  usersCount = nn;
}

function userPress(nn) {
  setClearCallbackup();

  $("#count").html(
    usersCount < 10 ? "0" + usersCount : usersCount);

  if (nn != simonsList[usersCount])
    usersTurnEndsWell(false);
  else if (usersCount == simonsCount)
    usersTurnEndsWell(true);
  else
    waitForUserPress(usersCount + 1);
}

function usersTurnEndsWell(success) {
  setClearCallbackup();

  usersTurn = false;

  $(".segment").removeClass("button");

  if (success) {
    simonsCount += 1;

    setClearCallbackup(function() {
      playRound(false); }, 1000);
  }
  else {
    $("#count").html("!!").css("text-decoration", "blink");

    var sound = new Audio(
      "https://www.myinstants.com/media/sounds/" +
      "the-simpsons-nelsons-haha.mp3");

    sound.volume = sound.volume * 0.25;
    sound.play();

    setClearCallbackup(function() {
      playRound(strictMode); }, 2500);
  }
}

function setClearCallbackup(callback, timeout) {
  if (timerId != undefined)
    clearInterval(timerId);

  if (callback != undefined)
    timerId = setInterval(callback, timeout);
  else
    timerId = undefined;
}

function segmentSelect(nn) {
  fillSegment(nn, 85);

  new Audio("https://s3.amazonaws.com/freecodecamp/" +
    "simonSound" + nn + ".mp3").play();
}

function segmentDeselect(nn) {
  fillSegment(nn, 45);
}

function fillSegment(nn, opacity) {
  var hue = (nn - 1) * 90;
  var hsl = "hsl(" + hue + ", 100%, " + opacity + "%)";

//$("#seg-" + nn).css("fill", hsl);
  document.getElementById("seg-" + nn).style.fill = hsl;
}

function drawSegments() {
  [1, 2, 3, 4].forEach(function (nn) {
    var seg = segment(200, 200, 180, (nn -1 ) * 90, nn * 90);

    //  $("#seg-4").attr("d", seg);
    document.getElementById("seg-" + nn)
      .setAttribute("d", seg);
    segmentDeselect(nn);
  });
}

// taken from https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle

function polarToCartesian(centerX, centerY, radius, degrees) {
  var radians = (degrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(radians)),
    y: centerY + (radius * Math.sin(radians))
  };
}

// adapted from https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle

function segment(x, y, radius, startAngle, endAngle) {
  var largeArc = endAngle - startAngle <= 180 ? "0" : "1";

  var sOfArc = polarToCartesian(x, y, radius, endAngle);
  var eOfArc = polarToCartesian(x, y, radius, startAngle);

  var d = [
    "M", x, y,
    "L", sOfArc.x, sOfArc.y,
    "A", radius, radius, 0, largeArc, 0, eOfArc.x, eOfArc.y,
    "L", x, y,
  ].join(" ");

  return d;
}