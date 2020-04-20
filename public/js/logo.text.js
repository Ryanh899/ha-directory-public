// fade ins and outs for logo text
$("body").on("click", "#ishrs-expand", function() {
    $("#artas-grid").fadeOut(350);
    $("#wts-grid").fadeOut(350);
    $("#club-grid").fadeOut(350);
    $("#ishrs-grid").fadeOut(500, () => {
      $("#ishrs-hide").css("display", "");
      $(this).css("display", "none");
      $("#ishrs-truncate").addClass("truncated");
      $("#ishrs-grid").fadeIn(500);
    });
  });
  
  $("body").on("click", "#ishrs-hide", function() {
    $("#artas-grid").fadeIn();
    $("#wts-grid").fadeIn();
    $("#club-grid").fadeIn();
    $("#ishrs-expand").css("display", "");
    $("#ishrs-hide").css("display", "none");
    $("#ishrs-truncate").removeClass("truncated");
  });
  
  $("body").on("click", "#artas-expand", function() {
    $("#ishrs-grid").fadeOut(350);
    $("#wts-grid").fadeOut(350);
    $("#club-grid").fadeOut(350);
    $("#artas-grid").fadeOut(500, () => {
      $("#artas-hide").css("display", "");
      $(this).css("display", "none");
      $("#artas-truncate").addClass("truncated");
      $("#artas-grid").fadeIn(500);
    });
  });
  
  $("body").on("click", "#artas-hide", function() {
    $("#ishrs-grid").fadeIn();
    $("#wts-grid").fadeIn();
    $("#club-grid").fadeIn();
    $("#artas-expand").css("display", "");
    $("#artas-hide").css("display", "none");
    $("#artas-truncate").removeClass("truncated");
  });
  
  $("body").on("click", "#wts-expand", function() {
    $("#ishrs-grid").fadeOut(350);
    $("#artas-grid").fadeOut(350);
    $("#club-grid").fadeOut(350);
    $("#wts-grid").fadeOut(500, () => {
      $("#wts-hide").css("display", "");
      $(this).css("display", "none");
      $("#wts-truncate").addClass("truncated");
      $("#wts-grid").fadeIn(500);
    });
  });
  
  $("body").on("click", "#wts-hide", function() {
    $("#artas-grid").fadeIn();
    $("#ishrs-grid").fadeIn();
    $("#club-grid").fadeIn();
    $("#wts-expand").css("display", "");
    $("#wts-hide").css("display", "none");
    $("#wts-truncate").removeClass("truncated");
  });
  
  $("body").on("click", "#club-expand", function() {
    $("#ishrs-grid").fadeOut(350);
    $("#artas-grid").fadeOut(350);
    $("#wts-grid").fadeOut(350);
    $("#club-grid").fadeOut(500, () => {
      $("#club-hide").css("display", "");
      $(this).css("display", "none");
      $("#club-truncate").addClass("truncated");
      $("#club-grid").fadeIn(500);
    });
  });
  
  $("body").on("click", "#club-hide", function() {
    $("#artas-grid").fadeIn();
    $("#wts-grid").fadeIn();
    $("#ishrs-grid").fadeIn();
    $("#club-expand").css("display", "");
    $("#club-hide").css("display", "none");
    $("#club-truncate").removeClass("truncated");
  });
  
  $("body").on("click", ".logo-click", function() {
    
    console.log('clicked')
    sessionStorage.setItem("lastLocation", "index");
    sessionStorage.setItem("logoSearch", $(this).attr('id'));
    window.location.assign("search.listings.html");
  });