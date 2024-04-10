let slidemenuopen = false;

function OpenSlideMenu(){
    const slidemenu = document.getElementById("SlideinMenu")
    if (!slidemenuopen){
        slidemenu.style.right = 0;
        slidemenuopen = true;
    } else {
        slidemenu.style.right = -500;
        slidemenuopen = false;
    }
}