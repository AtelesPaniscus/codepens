var players = 1001;
var toPlay  = undefined;
var iPlayAs = undefined;
var toGo    = undefined;
var timerId = undefined;

// a class to represent one of nine squares

function Square(x) {
  this.nn       = x;
  this.occupier = " ";
}

// a class to represent a winning line of squares

function Line(x, y, z) {
  this.squares =
    [new Square(x), new Square(y), new Square(z)];
  this.counts = [3, 3];

  this.resetState = function() {
    this.squares.forEach(function(square) {
      square.occupier = " ";
    });

    this.counts = [3, 3];
  }

  this.markOff = function(nn, player) {
    var t = this.squares.find(function(square) {
      if (square.nn == nn)
        square.occupier = player;

      return square.nn == nn;
    });

    if (t) {
      this.counts[Number(player != 'O')] -= 1;
      this.counts[Number(player != 'X')] = -1;
    }

    return t;
  }

  this.count = function(player) {
    var count = this.counts[Number(player != 'O')];

    return (count < 0) ? -1 : 3 - count;
  }

  this.free = function() {
    var t = this.squares.filter(function(square) {
      return square.occupier == ' ';
    });

    return t.map(function(square) {
      return square.nn;
    });
  }
}

var stateOfPlay = [
  new Line(1, 2, 3),
  new Line(4, 5, 6),
  new Line(7, 8, 9),
  new Line(1, 4, 7),
  new Line(2, 5, 8),
  new Line(3, 6, 9),
  new Line(1, 5, 9),
  new Line(3, 5, 7),
];

$(document).ready(setup());

function setup() {
  $("footer").css("position", "absolute");
  $(".footer-span").show();
  $("#noscript").hide();

  $("#reset-button").click(function() { reset(); });
  $("#reset-button").prop("disabled", false);

  $(".first").click(function() {
    chooseNumberOfPlayers($(this).attr("id").slice(-1));
  });

  $(".second").click(function() {
    chooseNoughtsOrCrosses($(this).attr("id").slice(-1));
  });

  $(".square").click(function() {
    updateSquare($(this).attr("id"));
  });

  $(".square").prop("disabled", true).html("");

  reset();
}

function reset() {
  if (timerId != undefined)
    clearInterval(timerId);
  timerId = undefined;

  $(".square").css("transition-delay", "0s")
      .css("opacity", "1.0");

  if (toPlay == undefined) {
    $(".first").show().prop("disabled",false);
    $(".second").hide();
    $("#dialogue").html(
      "Choose to play yourself (1) or me (2)");
    players = undefined;
  }
  else {
    $(".first").hide();
    $(".second").show().prop("disabled",false);
    $("#move").hide();
    $("#dialogue").html("Choose to play O or X");
    $(".square").html("").prop("disabled", true);
    toPlay = undefined;
  }

  stateOfPlay.forEach(function(line) {
    line.resetState();
  });

  toGo = 9;
}

function chooseNumberOfPlayers(choice) {
  players = Number(choice);

  iPlayAs = (players == 1) ? " " : undefined;

  toPlay = 'O';
  reset();
}

function chooseNoughtsOrCrosses(choice) {
  if (players == 2)
    iPlayAs = (choice == 'O') ? 'X' : 'O';

  $(".second").hide();

  if (players == 1)
    $("#dialogue").html("Solaire Game");
  else
    $("#dialogue").html("Game twix man and machine");

  toPlay = 'O';

  $("#move").html(toPlay + " to play").show();
  $(".square").prop("disabled", false);

  if (iPlayAs == 'O')
    makeMove();
}

function updateSquare(square) {
  var nn = Number(square.slice(-1));
  var player = toPlay;

  $("#" + square).html(player).prop("disabled", true);

  updateStateOfPlay(nn, player);

  if (toGo > 0) {
    toPlay = (toPlay == 'O') ? 'X' : 'O';

    $("#move").html(toPlay + " to play");

    if (iPlayAs == toPlay)
      thinkAboutMyMove();
  }
  else {
    $(".square").prop("disabled", true)
      .css("transition-delay", "1s")
      .css("opacity", "0.0");

    timerId = setInterval(function() { reset(); }, 4000);
  }
}

function updateStateOfPlay(nn, player) {
  stateOfPlay.forEach(function(line) {
    if (line.markOff(nn, player) != undefined)
      if (line.count(player) == 3)
        toGo = 0;
  });

  if (toGo == 0)
    $("#move").html("Game Over: " + player + " wins");

  toGo -= 1;

  if (toGo == 0)
    $("#move").html("Game Over: draw");
}

function thinkAboutMyMove () {
  if (timerId != undefined)
    clearInterval(timerId);
  timerId = setInterval(function() { makeMove(); }, 800);
}

function makeMove () {
  if (timerId != undefined)
    clearInterval(timerId);
  timerId = undefined;

  var opponent = (iPlayAs == 'O') ? 'X' : 'O';

  var moves = nextMove(iPlayAs, opponent);

  var choice = Math.floor(Math.random() * moves.length);

  updateSquare("square-" + moves[choice]);
}

function nextMove(player, opponent) {
  var moves = [];

  if (moves.length == 0)
    moves = checkForWinningMove(player);

  if (moves.length == 0)
    moves = checkForWinningMove(opponent);

  if (moves.length == 0)
    moves = checkForBestMoves(player, opponent, 0);

  if (moves.length == 0)
    moves = checkForBestMoves(player, opponent, 1);

  if (moves.length == 0)
    moves = freeSquares();

  return moves;
}

function checkForWinningMove(player) {
  return checkForGoodMoves(player, 2);
}

function checkForBestMoves(player, opponent, count) {
  return intersection(
    checkForBetterMoves(player, count),
    checkForBetterMoves(opponent, count));
}

function checkForBetterMoves(player, count) {
  var t = checkForGoodMoves(player, count);

  if (t.length == 0)
    return t;

  var c = t.reduce(function(counts, value) {
    counts[value - 1] += 1;
    return counts;
  }, [0, 0, 0, 0, 0, 0, 0, 0, 0]);

  if (toGo == 8)
    c[5-1] = 0;

  var median = c.reduce(function(maximum, value) {
    return value > maximum ? value : maximum;
  }, 0);

  return c.reduce(function(moves, count, index) {
    if (count == median)
      moves.push(index + 1);
    return moves;
  }, []);
}

function checkForGoodMoves(player, count) {
  return stateOfPlay.reduce(function(moves, line) {
    if (line.count(player) == count)
      moves = moves.concat(line.free());
    return moves;
  }, []);
}

function freeSquares() {
  return stateOfPlay.reduce(function(moves, line) {
    return union(moves, line.free());
  }, []);
}

function intersection(lhs, rhs) {
  return rhs.reduce(function(common, value) {
    if (lhs.indexOf(value) != -1)
      common.push(value);
    return common;
  }, []);
}

function union(lhs, rhs) {
  return rhs.reduce(function(union, value) {
    if (lhs.indexOf(value) == -1)
      union.push(value);
    return union;
  }, lhs);
}