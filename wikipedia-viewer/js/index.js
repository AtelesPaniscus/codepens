$(document).ready(setup());

function setup() {
  $("footer").css("position", "absolute");
  $(".footer-span").show();
  $("#noscript").hide();

  $(".activate-viewer").click(function() {
    $("footer").css("position","relative");
    $("#results-pane").prop("hidden", true);
    $("#viewer-pane").prop("hidden", false);
  });

  $("#search-button").click(function() {
    $("#viewer-pane").prop("hidden", true);

    search($("#term").val());
  });
}

function search(term) {
  if (term) {
//    var request = requestJSON(term);
    var request = requestCORS(term);

    $("#results-pane").prop("hidden", true);
    $("footer").css("position","absolute");
    $.getJSON(request, function(response) {
      displaySearchResults(response.query.search);
      $("footer").css("position","relative");
      $("#results-pane").prop("hidden", false);
    });
  }
}

function requestJSON(term) {
  // this simple request works in Web Maker
  var request = '';

  request += 'https://en.wikipedia.org/w/api.php';
  request += '?action=query&utf8=1';
  request += '&list=search';
  request += '&srsearch="' + term + '"';
  request += '&format=json';

  return request;
}

function requestCORS(term) {
  // this CORS solution works in CodePen and real browsers
  var request = requestJSON(term);

  request += "&origin=*";

  return 'https://cors-anywhere.herokuapp.com/' + request;
}

function displaySearchResults(results) {
  var listOfTitles = "";

  results.forEach(function(summary) {
    listOfTitles += summaryHtml(summary);
  });

  $("#results-pane").html(listOfTitles);
}

function summaryHtml(summary) {
  var html = "";

  html += '<div class="results-article">';

  html += '<a target="viewer"';

  html += ' href="https://en.wikipedia.org/?curid=';
  html += summary.pageid;
  html += '">';

  html += summary.title;
  html += '</a>';

  html += '<p class=results-snippet>';
  html += summary.snippet + "&hellip;";
  html += '</p>';

  html += '</div>';

  return html;
}