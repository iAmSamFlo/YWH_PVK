document.addEventListener("DOMContentLoaded", function () {
    var slider = document.getElementById("aslider");
    var sliderValueContainer = document.getElementById("sliderValueContainer");

  
    slider.addEventListener("input", function () {
        sliderValueContainer.textContent = slider.value*5 + "m";
    });
  });
  
