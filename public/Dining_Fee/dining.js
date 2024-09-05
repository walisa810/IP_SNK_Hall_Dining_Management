// Get the reference to the wrap div
const currentMonthContainer = document.getElementById("currentMonthContainer");
const nextMonthContainer = document.getElementById("nextMonthContainer");
// Get the current date
const currentDate = new Date();

// Get the current month (returns a number from 0 to 11)
const currentMonth = currentDate.getMonth();

// Array of month names
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];





// Set the content of the wrap div to the current month
const currentMonthText = document.createElement("span");
currentMonthText.textContent = "CURRENT MONTH: ";
currentMonthText.style.fontSize = "20px"; // Adjust font size as needed
currentMonthText.style.fontWeight = "450";
currentMonthText.style.display = "inline-block";// Align text to the bottom of the container

 // Adjust margin top as needed
currentMonthContainer.appendChild(currentMonthText);


// Create a span element for the current month name and style it
const monthSpan = document.createElement("span");
monthSpan.textContent = monthNames[currentMonth].toUpperCase(); 
monthSpan.style.color = "brown"; // Adjust color as needed
monthSpan.style.fontWeight = "600"; // Adjust font weight as needed
monthSpan.style.marginLeft = "10px"; // Adjust margin left as needed
// Set font family
monthSpan.style.fontSize = "35px";
monthSpan.style.marginTop="10px";
monthSpan.style.display = "inline-block";
currentMonthContainer.appendChild(monthSpan);

const nextMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1;
const nextMonthName = monthNames[nextMonthIndex];
const numDaysInNextMonth = new Date(currentDate.getFullYear(), nextMonthIndex + 1, 0).getDate();
const totalAmount2 = numDaysInNextMonth * 80;
// Set the content of the next month wrap div
const nextMonthText = document.createElement("span");
nextMonthText.textContent = "NEXT MONTH: ";
nextMonthText.style.fontSize = "20px"; // Adjust font size as needed
nextMonthText.style.fontWeight = "450";
nextMonthText.style.marginLeft = "20px";
nextMonthText.style.display = "inline-block";
// Adjust margin top as needed
nextMonthContainer.appendChild(nextMonthText);

// Create a span element for the next month name and style it
const nextMonthSpan = document.createElement("span");
nextMonthSpan.textContent = nextMonthName.toUpperCase();
nextMonthSpan.style.color = "brown"; // Adjust color as needed
nextMonthSpan.style.fontWeight = "600"; // Adjust font weight as needed
nextMonthSpan.style.marginLeft = "10px"; // Adjust margin left as needed
 // Set font family
nextMonthSpan.style.fontSize = "35px";
nextMonthSpan.style.marginTop = "10px";
nextMonthSpan.style.display = "inline-block";
nextMonthContainer.appendChild(nextMonthSpan);
const numDaysInMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();

// Create a span element for the text
const daysInMonthSpan = document.createElement("span");
const totalAmount = numDaysInMonth * 80;
daysInMonthSpan.textContent = "This month consisting of " + numDaysInMonth + " days having per meal 80tk requires total "+ totalAmount + "tk.";
daysInMonthSpan.style.color = "red"; // Adjust color as needed
daysInMonthSpan.style.fontWeight = "400"; // Adjust font weight as needed
 // Set font family
daysInMonthSpan.style.fontSize = "20px";
daysInMonthSpan.style.marginTop = "25px"; // Adjust margin top as needed
daysInMonthSpan.style.display = "block";
daysInMonthSpan.style.marginLeft="10px";
// Append daysInMonthSpan to currentMonthContainer
currentMonthContainer.appendChild(daysInMonthSpan);
// Create a span element for the additional text
const paymentPromptSpan = document.createElement("span");
paymentPromptSpan.textContent = "Do you want to pay? ";
paymentPromptSpan.style.color = "olive"; // Adjust color as needed
paymentPromptSpan.style.fontWeight = "600"; // Adjust font weight as needed
 // Set font family
paymentPromptSpan.style.fontSize = "24px";
paymentPromptSpan.style.marginTop = "40px"; // Adjust margin top as needed
paymentPromptSpan.style.display = "inline-block";
paymentPromptSpan.style.marginLeft = "10px"; // Adjust margin left as needed

// Append paymentPromptSpan to currentMonthContainer
currentMonthContainer.appendChild(paymentPromptSpan);

// Create a toggle button (checkbox)
// Create the button element
const payButton = document.createElement("button");
payButton.textContent = "PAY"; // Set the button text
payButton.style.backgroundColor = "gray"; // Set background color to olive ....skyblue
payButton.style.color = "white"; // Set text color to white
payButton.style.border = "1px solid black"; // Remove border
payButton.style.padding = "10px 20px"; // Add padding
payButton.style.fontWeight="600";
payButton.id = "payButton";
 // Set font family
 
payButton.style.fontSize = "20px"; // Set font size
payButton.style.cursor = "pointer"; // Set cursor to pointer
payButton.style.marginLeft = "20px"; 
// Append the button to the currentMonthContainer
currentMonthContainer.appendChild(payButton);
const daysInMonthSpan2 = document.createElement("span");
daysInMonthSpan2.textContent = "This month consisting of " + numDaysInNextMonth + " days having per meal 80tk requires total " + totalAmount2 + "tk.";
daysInMonthSpan2.style.color = "red"; // Adjust color as needed
daysInMonthSpan2.style.fontWeight = "400"; // Adjust font weight as needed
 // Set font family
daysInMonthSpan2.style.fontSize = "20px";
daysInMonthSpan2.style.marginTop = "25px"; // Adjust margin top as needed
daysInMonthSpan2.style.display = "block";
daysInMonthSpan2.style.marginLeft = "10px";
// Append daysInMonthSpan to nextMonthContainer
nextMonthContainer.appendChild(daysInMonthSpan2);

// Create a span element for the additional text
const paymentPromptSpan2 = document.createElement("span");
paymentPromptSpan2.textContent = "Do you want to pay? ";
paymentPromptSpan2.style.color = "olive"; // Adjust color as needed
paymentPromptSpan2.style.fontWeight = "600"; // Adjust font weight as needed
// Set font family
paymentPromptSpan2.style.fontSize = "24px";
paymentPromptSpan2.style.marginTop = "40px"; // Adjust margin top as needed
paymentPromptSpan2.style.display = "inline-block";
paymentPromptSpan2.style.marginLeft = "10px"; // Adjust margin left as needed

// Append paymentPromptSpan to nextMonthContainer
nextMonthContainer.appendChild(paymentPromptSpan2);

// Create a toggle button (checkbox)
// Create the button element
const payButton2 = document.createElement("button");
payButton2.textContent = "PAY"; // Set the button text
payButton2.style.backgroundColor = "gray"; // Set background color to olive
payButton2.style.color = "white"; // Set text color to white
payButton2.style.border = "1px solid black"; // Remove border
payButton2.style.padding = "10px 20px"; // Add padding
payButton2.style.fontSize = "20px"; // Set font size
payButton2.style.cursor = "pointer"; // Set cursor to pointer
payButton2.style.marginLeft = "20px";
payButton2.style.fontWeight="600";
payButton2.id = "payButton2";
// Append the button to nextMonthContainer
payButton2.className = "pay-button";
nextMonthContainer.appendChild(payButton2); 


//feedback form
feedButton = document.querySelector(".fb_btn");
feedBack = document.querySelector(".wrap");

feedButton.addEventListener('click',() =>{
    feedBack.classList.toggle('for3');
});

/* for user icon click*/
const User = document.querySelector('.user_icon');
const subMenu = document.querySelector('.sub-menu-wrap');

User.addEventListener("click", (e) => {
    console.log("Hi");
    subMenu.classList.toggle("f");
});

async function fetchAndDisplayDiningFee(id) {
    try {
        const response = await fetch(`/get_dining_fee/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Update your UI or handle the fetched data here
        console.log("Fetched dining fee record:", data);

        
        const payButton = document.getElementById('payButton');
        if (data.currentMonth !== 0) {
            payButton.textContent = 'PAID';
            payButton.style.backgroundColor = 'skyblue';
        } 
        const payButton2 = document.getElementById('payButton2');
        if (data.nextMonth !== 0) {
            payButton2.textContent = 'PAID';
            payButton2.style.backgroundColor = 'skyblue';
        } 
        
    } catch (error) {
        console.error('Error fetching dining fee record:', error);
        // Handle errors or display an error message
    }
}

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
        if (id) {
            fetchAndDisplayDiningFee(id);
        } else {
            console.error('User ID not found in URL');
        }
    }
    catch (error) {
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

    document.getElementById('payButton').addEventListener('click', () => handlePayButtonClick(id, 'current'));
    document.getElementById('payButton2').addEventListener('click', () => handlePayButtonClick(id, 'next'));

    function handlePayButtonClick(id, monthType) {
        if (!currentMonthContainer || !nextMonthContainer) {
            console.error('Containers not found or defined correctly.');
            return;
        }
        let totalAmountToPay = 0;
        // Determine which button was clicked and set the total amount to pay accordingly
        if (monthType === 'current') {
            totalAmountToPay = totalAmount; // Use totalAmount for current month
        } else if (monthType === 'next') {
            totalAmountToPay = totalAmount2; // Use totalAmount2 for next month
        }
        if (! totalAmountToPay) {
            console.error('Amount element not found.');
            return;
        }
       
        const amount = totalAmountToPay;
    
        Swal.fire({
            title: 'Insert the Transaction ID',
            html: `
                <div>
                    <div class='row_creation'>
                        <label for="amount" class="swal2-label">Amount</label>
                        <input id="amount" class="swal2-input" value="${amount}" readonly/>
                    </div>
                    <div class='row_creation'>
                        <label for="transaction-id" class="swal2-label">Transaction ID</label>
                        <input id="transaction-id" class="swal2-input" placeholder="Transaction ID"/>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Submit',
            customClass: {
                confirmButton: 'submit-button'
            },
            preConfirm: () => {
                const transactionId = Swal.getPopup().querySelector('#transaction-id').value;
                if (!transactionId) {
                    Swal.showValidationMessage("Transaction ID cannot be empty.");
                    return false;
                }
                return { amount, transactionId };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch('/pay_dining_fee', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id,
                            monthType,
                            amount: result.value.amount,
                            transactionId: result.value.transactionId
                        })
                    });
    
                    if (response.ok) {
                        console.log("hi there");
                        Swal.fire(
                            'Success!',
                            `Amount: ${result.value.amount}\nTransaction ID: ${result.value.transactionId}`,
                            'success'
                        ).then(() => {
                            const payButton = document.getElementById(monthType === 'current' ? 'payButton' : 'payButton2');
                            payButton.textContent = 'PAID';
                            payButton.style.backgroundColor = 'skyblue';
                        });
                    } else {
                        console.error('Failed to process payment');
                    }
                } catch (error) {
                    console.error('Error processing payment:', error);
                    Swal.fire(
                        'Error!',
                        'Failed to process payment. Please try again later.',
                        'error'
                    );
                }
            }
        });
    }
    
    
    
}