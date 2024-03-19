class ReviewPage {
  constructor (){
    this.closeBtn = document.getElementById("closebutton");
    this.slider = document.getElementById("aslider");
    this.submitBtn = document.getElementById("SubmitBtn");
    this.sliderValueContainer = document.getElementById("sliderValueContainer");
    this.activeButton = null;
    this.sliderContainer = document.getElementById('sliderContainer');
    this.safeButtons = document.querySelectorAll('.safebuttons');
    this.unsafeButton = document.getElementById('unsafe');
    this.safeButton = document.getElementById('safe');
    this.activeButton = null;
    // this.sliderContainer.classList.add('invisible');
    this.buttons = document.querySelectorAll('.tag');

    this.setupEventListeners();
  }


  setupEventListeners() {
    this.slider.addEventListener("input", () => {
      if (this.slider.value === "1") {
        this.sliderValueContainer.textContent = "Very safe";
      } else if (this.slider.value === "2") {
        this.sliderValueContainer.textContent = "Somewhat safe";
      } else if (this.slider.value === "3") {
        this.sliderValueContainer.textContent = "Slightly unsafe";
      } else if (this.slider.value === "4") {
        this.sliderValueContainer.textContent = "Very unsafe";
      }
    });
    this.closeBtn.addEventListener("click", () => {
      window.history.back();
    });
    this.submitBtn.addEventListener("click", () => {
      window.location = "thankyoupage.html";
      
    });
    // this.unsafeButton.addEventListener('click', function() {
    //   changeOpacity(this);
    // });
    // this.safeButtons.forEach(function(button) {
    //   button.addEventListener('click', function() {
    //       changeOpacity(this);
    //   });
    // });
    // this.buttons.forEach(function(button) {
    //   button.addEventListener('click', function() {
    //       toggleButton(button);
    //   });
    // });
  }

  changeOpacity(clickedButton) {
    // Add logic to check if Safe button is clicked or no safe buttons are pressed
    var safeButtonActive = false;
    this.safeButtons.forEach(function(button) {
        if (button === clickedButton) {
            safeButtonActive = true;
        }
        button.classList.remove('active');
    });

    clickedButton.classList.add('active');
    this.activeButton = clickedButton;
  }
 

  toggleButton(button) {
    button.classList.toggle('active');
  }
}