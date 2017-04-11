$(document).ready(function(){
  var aspectRatio = $("#csa").height()/$("#csa").width();

  if (aspectRatio != 0){
    var adjustedHeight;

    adjustedHeight = $("#ptp").width() * aspectRatio;
    $("#ptp").height(adjustedHeight);

    adjustedHeight = $("#ppp").width() * aspectRatio;
    $("#ppp").height(adjustedHeight);

    adjustedHeight = $("#wip").width() * aspectRatio;
    $("#wip").height(adjustedHeight);
  }

    $("#a50").click(function(){
      $("#a50").fadeToggle(2000);
      $("#a50").fadeToggle(2000);
    });
});