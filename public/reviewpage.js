document.addEventListener("DOMContentLoaded", function () {
  var slider = document.getElementById("aslider");
  var sliderValueContainer = document.getElementById("sliderValueContainer");

  slider.addEventListener("input", function () {
      sliderValueContainer.textContent = slider.value;
  });
});


var activeButton = null;

  function changeOpacity(clickedButton) {
    if (activeButton !== clickedButton) {
      if (activeButton) {
        activeButton.classList.remove('active');
      }

      clickedButton.classList.add('active');
      activeButton = clickedButton;
    }
  }