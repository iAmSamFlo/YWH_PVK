class Menu {
    constructor() {
        this.isUp = false;
        this.inputField = document.getElementById("InputField");
        this.buttons = document.querySelectorAll(".MenuButtons");
        this.inputValue = "";
        
        console.log("Input Field Element:", this.inputField);
        this.setupEventListeners();

        
    }

    MenuMove() {
        const menu = document.getElementById("PopUpMenu");
        if (this.isUp) {
            menu.style.top = window.innerHeight - 150 + 'px'
        } else {
            menu.style.top = window.innerHeight - 400 + 'px'
        }
        this.isUp = !this.isUp;
    }
    storeInput() {
        this.inputValue = this.inputField.value;
        console.log('Input value:', this.inputValue);
    }
    setupEventListeners() {
        this.inputField.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
            this.storeInput();
          }
        });
        document.getElementById("RollUpButton").addEventListener('touchmove', (e) => {
            // Get first touch
            var touch = e.targetTouches[0];
            const menu = document.getElementById("PopUpMenu");
            var clampedValue = Math.max(window.innerHeight - 400, Math.min(touch.clientY, window.innerHeight - 150));
            menu.style.top = clampedValue + 'px'
        });
        document.getElementById("RollUpButton").addEventListener('touchend', () => {
            const menu = document.getElementById("PopUpMenu");
            if(!this.isUp) {
            // This is triggered when it goes up
            console.log("hello");
            //console.log(this);
            this.isUp = true;
            menu.style.top = window.innerHeight - 400 + 'px';
            } else {
            // This is triggered when it goes down
            this.isUp = false;
            menu.style.top = window.innerHeight - 150 + 'px';
            }
        });
    }
}
