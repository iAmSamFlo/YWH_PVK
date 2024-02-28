
    let isUp = false;

    function MenuMove() {
        const menu = document.getElementById("PopUpMenu");
        if (this.isUp) {
            menu.style.height = "6vw";
        } else {
            menu.style.height = "50%";
        }
        this.isUp = !this.isUp;
    }

