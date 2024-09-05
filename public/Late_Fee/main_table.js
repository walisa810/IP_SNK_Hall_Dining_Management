document.addEventListener('DOMContentLoaded', initializePage);

const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
};

function initializePage() {
    const feedButton = document.querySelector(".fb_btn");
    const feedBack = document.querySelector(".wrap");
    const User = document.querySelector('.user_icon');
    const subMenu = document.querySelector('.sub-menu-wrap');

    window.onload = async function () {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        const id = urlParams.get('id');

        try {
            if (name) {
                const firstName = name.split(' ')[0];
                document.getElementById('User_ID').innerHTML = `${firstName}`;
                document.getElementById('User_H3').innerHTML = `${name}`;
            }

            if (id) {
                const response = await fetch(`/get_late_fee_records/${id}`);
                if (response.ok) {
                    const lateFeeRecords = await response.json();
                    console.log('Late Fee Records:', lateFeeRecords);

                    const lateFeeTableBody = document.querySelector('#lateFeeTable tbody');
                    lateFeeTableBody.innerHTML = '';

                    lateFeeRecords.forEach(record => {
                        const row = document.createElement('tr');
                        row.dataset.recordId = record._id;
                        row.innerHTML = `
                            <td>${record.monthYear}</td>
                            <td>${record.amountToBePaid}</td>
                            <td>
                                <p class="status">SELECT</p>
                            </td>
                        `;
                        lateFeeTableBody.appendChild(row);
                    });

                    const statusElements = document.querySelectorAll('.status');
                    statusElements.forEach(status => {
                    status.addEventListener('click', () => {
                    status.classList.toggle('selected');
                    if (status.classList.contains('selected')) {
                        status.innerHTML = 'SELECTED';
                    } else {
                        status.innerHTML = 'SELECT';
                    }
                    calculateTotalAmount();
                });
            });
                } else {
                    console.error('No late fee records found for id:', id);
                }
            }
        } catch (error) {
            console.error('Error fetching or processing late fee records:', error);
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
    }

    function attachStatusEventListeners() {
        const statusElements = document.querySelectorAll('.status');
        statusElements.forEach(status => {
            status.addEventListener('click', () => {
                status.classList.toggle('selected');
                if (status.classList.contains('selected')) {
                    status.innerHTML = 'SELECTED';
                } else {
                    status.innerHTML = 'SELECT';
                }
                calculateTotalAmount();
            });
        });
    }

    function calculateTotalAmount() {
        const selectedRows = document.querySelectorAll('.status.selected');
        let totalAmount = 0;
        selectedRows.forEach(row => {
            const amountCell = row.closest('tr').querySelector('td:nth-child(2)');
            const amount = parseInt(amountCell.textContent.trim());
            totalAmount += amount;
        });
        document.querySelector('.s2').textContent = totalAmount;
    }

    feedButton.addEventListener('click', () => {
        feedBack.classList.toggle('for3');
    });

    User.addEventListener("click", (e) => {
        console.log("Hi");
        subMenu.classList.toggle("f");
    });

    const payButton = document.querySelector('.btn1');
    payButton.addEventListener('click', () => {
        const totalAmount = document.querySelector('.s2').textContent.trim();
        if (parseInt(totalAmount) !== 0) {
            showAlert(totalAmount);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Total amount is zero. Please select at least one late fee to pay.',
            });
        }
    });

    function showAlert(totalAmount) {
        Swal.fire({
            title: 'Insert the Amount and Transaction ID',
            html: `
                <div>
                    <div class='row_creation'>
                        <label for="amount" class="swal2-label">Amount</label>
                        <input id="amount" class="swal2-input" value="${totalAmount}" readonly/>
                    </div>
                    <div class='row_creation'>
                        <label for="transaction-id" class="swal2-label">Transaction-ID</label>
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
                return { amount: totalAmount, transactionId: transactionId };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const selectedRows = document.querySelectorAll('.status.selected');
                const idsToDelete = [];
    
                selectedRows.forEach(row => {
                    const id = row.closest('tr').dataset.recordId;
                    idsToDelete.push(id);
                });
    
                try {
                    const response = await fetch('/delete_late_fee_records', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ids: idsToDelete })
                    });
    
                    if (response.ok) {
                        const responseData = await response.json();
                        console.log(responseData.message);
    
                        Swal.fire(
                            'Success!',
                            `Amount: ${result.value.amount}\nTransaction ID: ${result.value.transactionId}`,
                            'success'
                        ).then(() => {
                            setTimeout(() => {
                                window.location.reload();
                            }, 500);
                        });
                    } else {
                        console.error('Failed to delete late fee records');
                    }
                } catch (error) {
                    console.error('Error deleting late fee records:', error);
                }
            }
        });
    }
    
    

    ScrollReveal().reveal("header .logo_section p", {
        ...scrollRevealOption,
        delay: 500,
    });
}
