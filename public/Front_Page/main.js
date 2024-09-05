const navLinks = document.getElementById("nav-links");
const menuBtn = document.getElementById("menu-btn");
const menuBtnIcon = menuBtn.querySelector("i");
const loginBox = document.querySelector('.login_box');
const signupBox = document.querySelector('.signup_box');
const loginLink = document.querySelector('.login_link');
const registerLink = document.querySelector('.register_link');
const iconClose1 = document.querySelector('.icon_close1');
const iconClose2 = document.querySelector('.icon_close2');

menuBtn.addEventListener("click", (e) => {
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class","ri-menu-line");
});

const scrollRevealOption = {
    distance :"50px",
    origin: "bottom",
    duration: 1000,
};

ScrollReveal().reveal(".container_left h1",{
    ...scrollRevealOption,
});

ScrollReveal().reveal(".container_left .container_btn",{
    ...scrollRevealOption,
    delay: 500,
});
ScrollReveal().reveal(".container_right h4",{
    ...scrollRevealOption,
    delay: 2000,
});
ScrollReveal().reveal(".container_right h2",{
    ...scrollRevealOption,
    delay: 2500,
});
ScrollReveal().reveal(".container_right h3",{
    ...scrollRevealOption,
    delay: 3000,
});
ScrollReveal().reveal(".container_right p",{
    ...scrollRevealOption,
    delay: 3500,
});

ScrollReveal().reveal(".container_right .tent-1",{
    duration: 1000,
    delay: 4000,
});
ScrollReveal().reveal(".container_right .tent-2",{
    duration: 1000,
    delay: 4500,
});
ScrollReveal().reveal(".location",{
    ...scrollRevealOption,
    origin: "left",
    delay: 5000,
});
ScrollReveal().reveal(".socials span",{
    ...scrollRevealOption,
    origin:"top",
    delay: 3500,
    interval: 5000,
});

registerLink.addEventListener('click',() =>{
    loginBox.classList.toggle('for1');
    signupBox.classList.toggle('for2');
});
loginLink.addEventListener('click',() =>{
    signupBox.classList.toggle('for2');
    loginBox.classList.toggle('for1');
});
iconClose1.addEventListener('click', (e) =>{
    loginBox.classList.toggle('for1');
});
iconClose2.addEventListener('click',(e) => {
    signupBox.classList.toggle('for2');
});
document.getElementById('login_button_atfront').addEventListener('click', function() {
    loginBox.classList.toggle('for1');
});


document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const roleSelection = urlParams.get('role-selection');
    const name = urlParams.get('name');
    const id = urlParams.get('id'); 

    if (roleSelection === 'true') {
         // Perform actions specific to role selection
        Swal.fire({
            title: 'Select Your Role',
            text: 'Please select your role:',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Manager',
            cancelButtonText: 'Student',
            confirmButtonColor: 'hsl(24, 62%, 50%)',
            cancelButtonColor: 'hsl(24, 62%, 50%)'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to manager homepage
                window.location.href = `../Daily_Meal_Count/manager_homepage.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}&success=true`;
            } else {
                // Redirect to student page
                window.location.href = `../Meal_Calender/practice.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}&success=true`;
            }
        });
       
    }
});

