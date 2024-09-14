/* for user icon click*/
const User = document.querySelector('.user_icon');
const subMenu = document.querySelector('.sub-menu-wrap');

User.addEventListener("click", (e) => {
    console.log("Hi");
    subMenu.classList.toggle("f");
});

/* snk er scroll reveal*/
const scrollRevealOption = {
    distance :"50px",
    origin: "bottom",
    duration: 1000,
};

ScrollReveal().reveal("header .logo_section p",{
    ...scrollRevealOption,
    delay: 500,
});

/* feedback*/
feedButton = document.querySelector(".fb_btn");
feedBack = document.querySelector(".notifi-box");
feedButton.addEventListener('click',() =>{
    feedBack.classList.toggle('blow');
});

/* send reply*/
replyButton = document.querySelector(".rp_btn");
replyBack = document.querySelector(".wrap");
replyButton.addEventListener('click',() =>{
    replyBack.classList.toggle('book');
});
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const id = urlParams.get('id'); 

    console.log(name);

     //display name 
     if (name) {
        const firstName = name.split(' ')[0];
        document.getElementById('User_ID').innerHTML= `${firstName}`;
        document.getElementById('User_H3').innerHTML= `${name}`;
    }
    
    document.getElementById('redirectToDailyLunch').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Daily_Meal_Count/manager_homepage.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`;
    });
    document.getElementById('redirectToDailyDinner').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Daily_Meal_Count/dinner.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`;
    });
    document.getElementById('redirectToTableLunch').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Record/showtable.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`;
    });
    document.getElementById('redirectToTableDinner').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Record/table2.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`;
    });
    document.getElementById('redirectToSetMenu').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Set_Menu/setMenu.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`;
    });
    document.getElementById('redirectToShowMeal').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Show_Table/showta.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`;
    });
    document.getElementById('redirectToFeastDay').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Set_Feast/FeastDay.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`;
    });
});