window.onload = async function () {
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
        

        document.getElementById('redirectToPractice').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `../Meal_Calender/practice.html?name=${encodeURIComponent(name)}&id=${id}`;
        });
        document.getElementById('redirectToPractice1').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `../Meal_Calender/practice1.html?name=${encodeURIComponent(name)}&id=${id}`;
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
        // Fetch and display managers
        const response = await fetch('/managers');
        const managers = await response.json();

        const departmentMapping = {
            '01': 'CE',
            '02': 'EEE',
            '03': 'ME',
            '04': 'CSE',
            '05': 'URP',
            '06': 'Archi',
            '07': 'PME',
            '08': 'ETE',
            '09': 'MIE',
            '10': 'WRE',
            '11': 'BME',
            '12': 'MSE'
        };

        if (managers.length > 0) {
            const manager1 = document.getElementById('manager1');
            const dept = managers[0].id;
            const deptCode = dept.slice(2, 4);
            const department = departmentMapping[deptCode] || 'Unknown';
            manager1.querySelector('h3').textContent = managers[0].name;
            manager1.querySelector('.role:nth-of-type(1)').textContent = `Department: ${department}`;
            manager1.querySelector('.role:nth-of-type(2)').textContent = `ID: ${managers[0].id}`;
            manager1.querySelector('.role:nth-of-type(3)').textContent = `Contact No: ${managers[0].contno}`;
        }

        if (managers.length > 1) {
            const manager2 = document.getElementById('manager2');
            const dept = managers[0].id;
            const deptCode = dept.slice(2, 4);
            const department = departmentMapping[deptCode] || 'Unknown';
            manager2.querySelector('h3').textContent = managers[1].name;
            manager2.querySelector('.role:nth-of-type(1)').textContent = `Department: ${department}`;
            manager2.querySelector('.role:nth-of-type(2)').textContent = `ID: ${managers[1].id}`;
            manager2.querySelector('.role:nth-of-type(3)').textContent = `Contact No: ${managers[1].contno}`;
        }
    }catch (error) {
        console.error("Error fetching managers:", error);
    }
}
/* for user icon click*/
const User = document.querySelector('.user_icon');
const subMenu = document.querySelector('.sub-menu-wrap');

User.addEventListener("click", (e) => {
    console.log("Hi");
    subMenu.classList.toggle("f");
});