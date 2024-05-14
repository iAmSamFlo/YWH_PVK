class ReviewPage {
  constructor (){
    this.closeBtn = document.getElementById("closebutton");
    this.slider = document.getElementById("aslider");
    this.submitBtn = document.getElementById("SubmitBtn");
    this.sliderValueContainer = document.getElementById("sliderValueContainer");
    this.commentTextarea = document.getElementById('comment');
    this.activeButton = null;
    this.sliderContainer = document.getElementById('sliderContainer');
    this.activeButton = null;
    this.rate = 1;
    // this.sliderContainer.classList.add('invisible');
    this.buttons = document.querySelectorAll('.tag');

    this.tags = [];

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
      this.rate = this.slider.value;
    });
    this.closeBtn.addEventListener("click", () => {
      window.history.back();
    });
    this.submitBtn.addEventListener("click", () => {
      
      var coord = localStorage.getItem('coord');
      var radius = localStorage.getItem('radius');

      var { lat, lng } = JSON.parse(coord);

      // Get the comment from the textarea
      const comment = this.commentTextarea.value.trim();

      this.sendData(lat, lng, radius, this.rate, this.tags, comment);
      window.location = "thankyoupage.html";
      
    });
  }

 
  toggleButton(button, id) {
    button.classList.toggle('active');
    if(button.classList.contains('active')){
      this.tags.push(id);
    } else {
      this.tags = this.tags.filter(tag => tag !== id);
    }
    console.log(this.tags);
  }
  
  async sendData(latitude, longitude, radius, rate, tags, message) {
    try {
      // console.log('Sending data:', { latitude, longitude, radius, rate, tags, message });
      const response = await fetch('/sendData', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude, longitude, radius, rate, tags, message }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log('Response from server:', result);
    } catch (error) {
        console.error('Error sending data:', error);
    }
  }

}