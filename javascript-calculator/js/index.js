var entry = "0";
var formula = "";
var accumulator = 0;

$(document).ready(setup());

function setup() {
  $("footer").css("position", "absolute");
  $(".footer-span").show();
  $("#noscript").hide();

  $(".digit").click(function() {
    inputDigit($(this).html());
  });

  $(".function").click(function() {
    inputFunction($(this).html());
  });

  $(".enter").click(function() {
    enterInput();
  });

  $(".cancel").click(function() {
    cancelInput();
  });

  $(".clear").click(function() {
    clearAccumulator();
  });

  clearAccumulator();
  updateDisplay();
}

function inputDigit(nn) {
  digit = nn.trim();

  if (entry == "0")
    entry = digit;
  else
    entry += digit;

  if (digit == ".")
    $(".decimal").prop("disabled", true);
  else if (formula == "")
    $(".enter").prop("disabled", false);
  else {
    $(".enter").prop("disabled", true);
    $(".function").prop("disabled", false);
  }

  if (String(entry).length > 9) {
    $(".digit").prop("disabled", true);
  }

  updateDisplay();
  $("#test").html(entry);
}

function enterInput() {
  if (formula == "") {
    formula = entry + " = ";
    accumulator = Number(entry);

    entry = "0";
    $(".function").prop("disabled", true);
    $(".decimal").prop("disabled", false);
  }
  else {
    entry = accumulator;
    $(".function").prop("disabled", false);
  }

  $(".enter").prop("disabled", false);

  updateDisplay();
}

function inputFunction(fn) {
  operator = fn.trim();
  formula += " " + entry + " " + operator;
  
  if (operator == '+')
    accumulator += Number(entry);
  else if (operator == '-')
    accumulator -= Number(entry);
  else if (operator == '×')
    accumulator *= Number(entry);
  else if (operator == '÷')
    accumulator /= Number(entry);

  entry = "0";
  $(".enter").prop("disabled", false);
  $(".function").prop("disabled", true);
  $(".decimal").prop("disabled", false);

  updateDisplay();
  $("#test").html(operator);
}

function cancelInput() {
  entry = "0";
  $(".enter").prop("disabled", true);
  $(".function").prop("disabled", true);
  $(".digit").prop("disabled", false);

  updateDisplay();
}

function clearAccumulator() {
  accumulator = 0;
  formula = "";

  cancelInput();
}

function updateDisplay() {
  $("#entry").text(largeNumber(entry));
  $("#formula").text(formula.slice(-18));
  $("#accumulator").text(largeNumber(accumulator));
}

function largeNumber(number) {
  var text = String(number);

  if (text.length <= 10)
    return (text);

  for (var ii = 9; ii > 0; --ii) {
    text = number.toExponential(ii);

    if (text.length <= 10)
      return (text);
  }

  return "**********";
}