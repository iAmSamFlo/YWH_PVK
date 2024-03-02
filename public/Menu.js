class Menu {
    constructor() {
        this.isUp = false;
        this.inputField = document.getElementById("InputField");
        this.inputValue = "";
        
        console.log("Input Field Element:", this.inputField);
        this.setupEventListeners();
    }

    MenuMove() {
        const menu = document.getElementById("PopUpMenu");
        if (this.isUp) {
            menu.style.bottom = "0"
        } else {
            menu.style.bottom = "-600";
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
    }
}
