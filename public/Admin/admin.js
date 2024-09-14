document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    try{
        //display name 
        if (name) {
            const firstName = name.split(' ')[0];
            document.getElementById('User_ID').innerHTML= `${firstName}`;
            document.getElementById('User_H3').innerHTML= `${name}`;
        }
        fetchStudents();
        addEventListeners();
    }
    catch(error) {
        console.error("Error fetching lunch record:", error);
    }
    document.getElementById('redirectToStudentInfo').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Admin/admin.html?name=${encodeURIComponent(name)}`;
    });
    document.getElementById('redirectToCurrentManager').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Current_Manager/currentm1.html?name=${encodeURIComponent(name)}`;
    });
    document.getElementById('redirectToManagerSelection').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../Manager_Selection/practable_ag.html?name=${encodeURIComponent(name)}`;
    });
});

const fetchStudents = async () => {
    try {
        const response = await fetch('/students');
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        const students = await response.json();
        populateTable(students);
    } catch (error) {
        console.error('Error fetching students:', error);
    }
};

const populateTable = (students) => {
    const regList = document.querySelector('.reg-list');
    regList.innerHTML = '';

    students.forEach((student, index) => {
        const dataStr = JSON.stringify({
            name: student.name,
            sid: student.id,
            rno: student.roomno,
            con: student.contno,
            passwd: student.password
        }).replace(/"/g, "'");

        regList.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.roomno}</td>
                <td>${student.contno}</td>
                <td>
                    <button class="edit-btn btn p-1 px-2 btn-primary" data="${dataStr}" index="${index}">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="del-btn btn p-1 px-2 btn-danger" data-id="${student.id}">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    addEventListeners();
};

const addEventListeners = () => {
    document.querySelectorAll('.del-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            const isConfirm = await confirmDeletion();
            if (isConfirm) {
                await deleteStudent(id);
            }
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            let index = button.getAttribute("index");
            let dataStr = button.getAttribute("data");
            let finalData = dataStr.replace(/'/g, '"');
            let data = JSON.parse(finalData);
            addBtn.click();

            // Fill form with existing student data
            allInput[0].value = data.name;
            allInput[1].value = data.sid;
            allInput[2].value = data.rno;
            allInput[3].value = data.con;
            allInput[4].value = data.passwd;

            // Enable edit button and disable add button
            allBtn[0].disabled = false;
            allBtn[1].disabled = true;

            allBtn[0].onclick = async () => {
                const updatedData = {
                    Name: allInput[0].value,
                    Student_ID: allInput[1].value,
                    Room_No: allInput[2].value,
                    Contact_No: allInput[3].value,
                    Password: allInput[4].value
                };

                try {
                    const response = await fetch(`/students/${data.sid}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedData)
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update student');
                    }

                    swal("Data Updated", "Successfully!", "success");
                    closeBtn.click();
                    regForm.reset();
                    fetchStudents();

                    // Reset button states
                    allBtn[0].disabled = true;
                    allBtn[1].disabled = false;
                } catch (error) {
                    console.error('Error updating student:', error);
                }
            };
        });
    });
};

const deleteStudent = async (id) => {
    try {
        const response = await fetch(`/students/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Failed to delete student');
        }
        fetchStudents(); // Refresh the student list after deletion
        swal("Deleted!", "Student has been deleted.", "success");
    } catch (error) {
        console.error('Error deleting student:', error);
    }
};

const confirmDeletion = () => {
    return swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this data!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        return willDelete;
    });
};

document.querySelector('.register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        name: formData.get('Name'),
        id: formData.get('Student_ID'),
        roomno: formData.get('Room_No'),
        contno: formData.get('Contact_No'),
        password: formData.get('Password')
    };

    console.log(data);
    try {
        const response = await fetch('/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to add student');
        }

        fetchStudents();
        swal("Added!", "Student has been added.", "success");
        e.target.reset();
        closeBtn.click(); // Close the form after submission
    } catch (error) {
        console.error('Error adding student:', error);
    }
    
});

document.querySelector('.delete-all-btn').addEventListener('click', async () => {
    try {
        const isConfirm = await confirmDeletion();
        if (isConfirm) {
            const response = await fetch('/students', { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Failed to delete all students');
            }
            fetchStudents();
            swal("Deleted!", "All students have been deleted.", "success");
        }
    } catch (error) {
        console.error('Error deleting all students:', error);
    }
});

document.querySelector('.search').addEventListener('input', () => {
    search();
});

const search = () => {
    const value = document.querySelector('.search').value.toLowerCase();
    const tr = document.querySelectorAll(".reg-list tr");
    tr.forEach(row => {
        const allTd = row.querySelectorAll("td");
        const sid = allTd[0].innerHTML;
        const name = allTd[1].innerHTML.toLowerCase();
        const rno = allTd[2].innerHTML;
        const con = allTd[3].innerHTML;
        if (sid.includes(value) || name.includes(value) || rno.includes(value) || con.includes(value)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
};

const addBtn = document.querySelector('.add-btn');
const regForm = document.querySelector('.register-form');
const allInput = regForm.querySelectorAll('input');
const allBtn = regForm.querySelectorAll('button');
const closeBtn = document.querySelector('.btn-close');
const regList = document.querySelector('.reg-list');

addBtn.addEventListener('click', () => {
    regForm.reset();
    allBtn[0].disabled = true;
    allBtn[1].disabled = false;
});
/* for user icon click*/
const User = document.querySelector('.user_icon');
const subMenu = document.querySelector('.sub-menu-wrap');

User.addEventListener("click", (e) => {
    console.log("Hi");
    subMenu.classList.toggle("f");
});


