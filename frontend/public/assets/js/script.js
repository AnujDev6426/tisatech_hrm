// circle
let options = {
  startAngle: 1.55,
  size: 100,
  value: 0.80,
  fill: {gradient: ['#744BFF']}
}
$(".circle .bar").circleProgress(options).on('circle-animation-progress',
function(event, progress, stepValue){
  $(this).parent().find("span").text(String(stepValue.toFixed(2).substr(2)) + "%");
});
// circle
let options1 = {
  startAngle: -1.55,
  size: 100,
  value: 0.50,
  fill: {gradient: ['#0CC492']}
}
$(".circle1 .bar1").circleProgress(options1).on('circle-animation-progress',
function(event, progress, stepValue){
  $(this).parent().find("hours").text(String(stepValue.toFixed(1).substr(1)) + "%");
});
// birthday slider
$('.birthday_slider').slick({
  dots: true,
  infinite: false,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
  ]
});
// read more and read less js
function readMore(id) {
  var dots = document.getElementById("dots"+id);
  var moreText = document.getElementById("more"+id);
  var btnText = document.getElementById("myBtn"+id);

  if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more";
      moreText.style.display = "none";
  } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less";
      moreText.style.display = "inline";
  }
 }

//menu js
$('.openMenu').on('click', function () { $('.dashboard_left_block').toggleClass('active'); });

$('.closemenu').on('click',
function () { $('.dashboard_left_block').removeClass('active'); });

$(document).click(function (event) { if (!$(event.target).closest(".dashboard_left_block, .openMenu").length) { $("body").find(".dashboard_left_block").removeClass("active"); } });

// data picker
$( function() {
	$( "#datepicker" ).datepicker({
		dateFormat: "dd-mm-yy"
		,	duration: "fast"
	});
  $( "#datepicker1" ).datepicker({
		dateFormat: "dd-mm-yy"
		,	duration: "fast"
	});
} );
// pasword show hide button
$(".toggle-password").click(function () {
  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
      input.attr("type", "text");
  } else {
      input.attr("type", "password");
  }
});
