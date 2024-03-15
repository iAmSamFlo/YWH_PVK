document.addEventListener("DOMContentLoaded", function () {
  var slider = document.getElementById("aslider");
  var sliderValueContainer = document.getElementById("sliderValueContainer");

  slider.addEventListener("input", function () {
    if (slider.value === "1") {
      sliderValueContainer.textContent = "Very safe";
    } else if (slider.value === "2") {
      sliderValueContainer.textContent = "Somewhat safe";
    } else if (slider.value === "3") {
      sliderValueContainer.textContent = "Slightly unsafe";
    } else if (slider.value === "4") {
      sliderValueContainer.textContent = "Very unsafe";
    }
  });
});

var activeButton = null;

document.addEventListener("DOMContentLoaded", function() {
  var sliderContainer = document.querySelector('.slider-container');
  var safeButtons = document.querySelectorAll('.safebuttons');
  var unsafeButton = document.getElementById('unsafe');
  var safeButton = document.getElementById('safe');
  var activeButton = null;

  // Set the default display of slider container to none
  sliderContainer.classList.add('invisible');

  function changeOpacity(clickedButton) {
      // Add logic to check if Safe button is clicked or no safe buttons are pressed
      var safeButtonActive = false;
      safeButtons.forEach(function(button) {
          if (button === clickedButton) {
              safeButtonActive = true;
          }
          button.classList.remove('active');
      });

      clickedButton.classList.add('active');
      activeButton = clickedButton;
  }

  unsafeButton.addEventListener('click', function() {
      changeOpacity(this);
  });

  safeButtons.forEach(function(button) {
      button.addEventListener('click', function() {
          changeOpacity(this);
      });
  });

  const buttons = document.querySelectorAll('.tag');

  function toggleButton(button) {
      button.classList.toggle('active');
  }

  buttons.forEach(function(button) {
      button.addEventListener('click', function() {
          toggleButton(button);
      });
  });
});
