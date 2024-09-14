async function fetchAnotherMealCounts() {
    try {
        const response = await fetch('/another-meal-counts');
        const data = await response.json();

        const tableBody = document.querySelector('#meal-counts-table tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        data.forEach(mealCount => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mealCount.regular}</td>
                <td>${mealCount.staff}</td>
                <td>${mealCount.extra}</td>
                <td>${mealCount.total}</td>
                <td>${new Date(mealCount.date).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching meal counts:', error);
    }
    const urlParams = new URLSearchParams(window.location.search);
  
   const name = urlParams.get('name');
   const id = urlParams.get('id'); 

  
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
}

document.addEventListener('DOMContentLoaded', fetchAnotherMealCounts);

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

/* send reply
replyButton = document.querySelector(".rp_btn");
replyBack = document.querySelector(".wrap");
replyButton.addEventListener('click',() =>{
    replyBack.classList.toggle('book');
});*/