setTimeout(function () {
    // var create = document.querySelector(".create");
    $("#create").typed({
        strings: ["CREATE"],
        typeSpeed: 30, // typing speed
        backDelay: 750, // pause before backspacing
        loop: false, // loop on or off (true or false)
        loopCount: false, // number of loops, false = infinite
        callback: function () {} // call function after typing is done
    });
}, 0);

setTimeout(function () {
    // var share = document.querySelector(".share");
    $("#share").css("display", "inherit");
    $("#share").typed({
        strings: ["SHARE"],
        typeSpeed: 30, // typing speed
        backDelay: 750, // pause before backspacing
        loop: false, // loop on or off (true or false)
        loopCount: false, // number of loops, false = infinite
        callback: function () {} // call function after typing is done
    });
}, 2000);

setTimeout(function () {
    // var explore = document.querySelector(".explore");
    $(".explore").css("display", "inherit");
    $("#explore").typed({
        strings: ["EXPLORE"],
        typeSpeed: 30, // typing speed
        backDelay: 750, // pause before backspacing
        loop: false, // loop on or off (true or false)
        loopCount: false, // number of loops, false = infinite
        callback: function () {} // call function after typing is done
    });
}, 4000);

var nav = document.querySelector('#header');
var divnav = document.querySelector('#header div');
nav.style.color = "white !important";

// UI modifiers
window.onscroll = (e) => {
    console.log(e);
    
    console.log(nav,this.scrollY);
    if (this.scrollY <= 20) {
        nav.className = 'mdl-layout__header mdl-color-text--white';
        nav.style.color = "white !important";
    } else {
        nav.className = 'mdl-layout__header scroll';
        divnav.style.color = "black !important";
    }
};