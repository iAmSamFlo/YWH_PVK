let slidemenuopen = false;

function OpenSlideMenu(){
    const slidemenu = document.getElementById("SlideinMenu")
    if (slidemenuopen){
        slidemenu.style.right = 0;
        slidemenuopen = false;
    } else {
        slidemenu.style.right = -500;
        slidemenuopen = true;
    }
}