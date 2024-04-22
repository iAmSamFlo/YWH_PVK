var routeSetting; // 0 = fastest 1 = easy to remember 2 = safest

const nextBtn = document.getElementById("nextBtn");
const skipBtn = document.getElementById("skipBtn");

const radioButtons = document.querySelectorAll('input[name="radio"]');

// Add event listener to each radio button
radioButtons.forEach(button => {
    button.addEventListener('change', () => {
        if (button.checked) {
            routeSetting = button.value;
            console.log(button.value);
        }
    });
});

nextBtn.addEventListener('click', () => {
    if(routeSetting == "0"){
        sessionStorage.setItem('preference', 0);
        console.log("Stores value 0!");
    }
    if(routeSetting == "1"){
        sessionStorage.setItem('preference', 1);
        console.log("Stores value 1!");
    }
    //console.log("from session: ", sessionStorage.getItem('preference'));
    window.location = "index.html";
});
skipBtn.addEventListener('click', () => {
    sessionStorage.setItem('preference', 0);
    console.log("Skips and stores value 0!");
    //console.log("from session: ", sessionStorage.getItem('preference'));
    window.location = "index.html";
});

