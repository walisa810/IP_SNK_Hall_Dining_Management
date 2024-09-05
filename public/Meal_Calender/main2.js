const currentDate = document.querySelector(".current_date"),
daysTag = document.querySelector(".days"),
prevNextIcon = document.querySelectorAll(".icons1 span");
feedButton = document.querySelector(".fb_btn");
feedBack = document.querySelector(".wrap");

let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

window.onload = async function () {
    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const id = urlParams.get('id'); 

    try {
        //display name 
        if (name) {
            const firstName = name.split(' ')[0];
            document.getElementById('User_ID').innerHTML= `${firstName}`;
            document.getElementById('User_H3').innerHTML= `${name}`;
        }
        // Fetch lunch record for the user
        const response = await fetch(`/get_lunch/${id}`);
        if (!response.ok) {
            console.error("Failed to fetch lunch record");
            return;
        }

        const lunchRecord = await response.json();
        console.log("Fetched lunch record:", lunchRecord);

        // Render calendar with lunch record data
        renderCalendar(lunchRecord);
        // Fetch dining fee record for the user
        const diningFeeResponse = await fetch(`/get_dining_fee/${id}`);
        if (!diningFeeResponse.ok) {
            console.error("Failed to fetch dining fee record");
            return;
        }
        const diningFeeRecord = await diningFeeResponse.json();
        console.log("Fetched dining fee record:", diningFeeRecord);
        const currentMonth = diningFeeRecord.currentMonth;
        if (currentMonth === 0) {
            Swal.fire({
                title: 'Reminder',
                text: 'You did not pay Meal Fee! Want to Pay?',
                icon: 'info',
                confirmButtonText: 'YES'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect to another page
                    window.location.href = `dining_fee.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`;
                }
            });
        }
    } catch (error) {
        console.error("Error fetching lunch record:", error);
    }
    document.getElementById('redirectToPractice').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Meal_Calender/practice.html?name=${encodeURIComponent(name)}&id=${id}`;
    });
    document.getElementById('redirectToPractice1').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `..Meal_Calender/practice1.html?name=${encodeURIComponent(name)}&id=${id}`;
    });
    document.getElementById('redirectToMenu').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Menu/menu.html?name=${encodeURIComponent(name)}&id=${id}`;
    });
    document.getElementById('redirectToManager').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Current_Manager/currentm.html?name=${encodeURIComponent(name)}&id=${id}`;
    });
    document.getElementById('redirectToDiningFee').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Dining_Fee/dining_fee.html?name=${encodeURIComponent(name)}&id=${id}`;
    });
    document.getElementById('redirectToLateFee').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Late_Fee/table.html?name=${encodeURIComponent(name)}&id=${id}`;
    });
    checkFeastDate();
};

const renderCalendar = (lunchRecord) => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(); //getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(); //getting last date of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); //getting last date of last month
    lastDayofMonth = new Date(currYear, currMonth + 1, lastDateofMonth).getDay(); //getting last day of month
    let liTag = "";
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class='inactive'>${lastDateofLastMonth - i + 1}</li>`;
    }
    for (let i = 1; i <= lastDateofMonth; i++) {
        // Check if the day is marked in the lunch record
        let isMarked = lunchRecord && lunchRecord.days[i] === true;
        // adding active class if current date , month , year matched
        let isActive =
        currYear < new Date().getFullYear() ||
        (currMonth < new Date().getMonth() &&
            currYear === new Date().getFullYear()) ||
        (i <= date.getDate() &&
            currMonth === new Date().getMonth() &&
            currYear === new Date().getFullYear())
            ? "active"
            : "";

        liTag += `<li class="${isActive}" id="${i}">
                    <span class='cross-mark1' style="display: ${
                    isMarked ? "block" : "none"
                    }"></span>${i}
                </li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class='inactive'>${i - lastDayofMonth + 1}</li>`;
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    /* for clicking mechanism */
    daysTag.querySelectorAll('li').forEach(day => {
        day.addEventListener('click', async () => {
            if (!day.classList.contains('active') && !day.classList.contains('inactive')) {
                const crossMark1 = day.querySelector('.cross-mark1');
                const isMarked = crossMark1.style.display === 'none';
                crossMark1.style.display = isMarked ? 'block' : 'none';

                const dayNumber = parseInt(day.id);

                const urlParams = new URLSearchParams(window.location.search);
                const id = urlParams.get('id');

                console.log(id);
                console.log(dayNumber);

                try {
                    const response = await fetch('/update_lunch', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id, day: dayNumber })
                    });

                    if (response.ok) {
                        console.log('Meal record updated successfully');
                    } else {
                        console.error('Error updating meal record');
                    }
                } catch (error) {
                    console.error('Error updating meal record:', error);
                }
            }
        });
    });
};


prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        //prev click korle month kombe ,nahole barbe
        currMonth = icon.id === 'prev' ? currMonth - 1 : currMonth + 1;
        if (currMonth < 0 || currMonth > 11) {//year undefined fixing
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        }
        else {
            date = new Date();
        }
        renderCalendar();
    })
})
const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
};

ScrollReveal().reveal("header .logo_section p", {
    ...scrollRevealOption,
    delay: 500,
});

feedButton.addEventListener('click', () => {
    feedBack.classList.toggle('for3');
});
/* for user icon click*/
const User = document.querySelector('.user_icon');
const subMenu = document.querySelector('.sub-menu-wrap');

User.addEventListener("click", (e) => {
    subMenu.classList.toggle("f");
});

async function checkFeastDate() {
    try {
        const response = await fetch('/upcoming-feast');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const feasts = await response.json();

        // Ensure feasts is an array
        if (!Array.isArray(feasts) || feasts.length === 0) {
            console.error('No upcoming feasts found');
            return;
        }
        // Get today's date without the time component
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find the first feast with "lunch" as the first meal
        const lunchFeast = feasts.find(feast => {
            const feastDate = new Date(feast.date);
            return feastDate >= today && feast.meals[0].toLowerCase() === 'dinner';
        });

        if (lunchFeast) {
            const link = lunchFeast.image;
            document.querySelector('.ad').style.display = 'block';
            document.querySelector('.ad .ad_btn').addEventListener('click', () => showPopup(link));
        } else {
            document.querySelector('.ad').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching feast date:', error);
    }
}
    
function showPopup(link) {
    /*console.log(link);*/
    document.getElementById('popup').style.display = 'flex';
    document.getElementById('popup-image').src = `./uploads/${link}`;
}

document.getElementById('popup-close').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});

// Optionally, hide popup when clicking outside of content
document.getElementById('popup').addEventListener('click', function(event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});


