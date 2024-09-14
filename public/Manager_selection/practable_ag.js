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
/* for user icon click*/
const User = document.querySelector('.user_icon');
const subMenu = document.querySelector('.sub-menu-wrap');

User.addEventListener("click", (e) => {
    console.log("Hi");
    subMenu.classList.toggle("f");
});

$(document).ready(function () {
    loadGridData();

    // Disable the top checkbox beside Student ID column
    $('#chkAll').on('change', function() {
        return false; // Prevents change event from affecting the checkbox
    });

    // Handle checkbox changes in table rows
    $('#tblData').on('change', '.tblChk', function () {
        var checkedCount = $('.tblChk:checked').length;
        var maxSelections = 2;

        if (checkedCount > maxSelections) {
            $(this).prop('checked', false);
        } else {
            var selectedId = $(this).attr("data-id");
            if ($(this).is(':checked')) {
                // If the checkbox is checked, update the 'type' field to true
                updateTypeField(selectedId, true);
            } else {
                // If the checkbox is unchecked, update the 'type' field to false
                updateTypeField(selectedId, false);
            }
        }

        getCheckRecords();
    });

    function getCheckRecords() {
        // Clear the selected records display
        $(".selectedDiv").empty();

        $('.tblChk:checked').each(function () {
            // No need to collect or display selected IDs or any other relevant information
            // var selectedId = $(this).attr("data-id");
            // $(".selectedDiv").append('<div>' + selectedId + '</div>');
        });
    }

    function loadGridData() {
        console.log('Fetching data...');
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/students",
            contentType: "application/json",
            processData: false,
            beforeSend: function () {
                console.log('Before sending request...');
                $("#trLoader").show();
            },
            success: function (results) {
                console.log('Data received:', results);
                $("#trLoader").remove();
                $("#tblData tbody").empty(); // Clear the existing rows
                results.forEach(element => {
                    let isChecked = element.type ? "checked" : "";
                    let dynamicTR = "<tr>";
                    dynamicTR += "<td><input type='checkbox' data-id='" + element.id + "' class='largerCheckbox tblChk' " + isChecked + "/></td>";
                    dynamicTR += "<td>" + element.id + "</td>";
                    dynamicTR += "<td>" + element.name + "</td>";
                    dynamicTR += "<td>" + element.roomno + "</td>";
                    dynamicTR += "<td>" + element.contno + "</td>";
                    dynamicTR += "</tr>";
                    $("#tblData tbody").append(dynamicTR);
                });
            },
            error: function (error) {
                console.error('Error fetching data:', error);
                $("#trLoader").html('<div class="text-center">Error loading data</div>');
            }
        });
    }

    // Searching
    $(".search").on("input", function () {
        searchTable($(this).val().toLowerCase());
    });

    function searchTable(value) {
        $("#tblData tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    }

    function updateTypeField(studentId, typeValue) {
        $.ajax({
            type: "PUT",
            url: "http://localhost:3000/students/updateType/" + studentId,
            data: JSON.stringify({ type: typeValue }),
            contentType: "application/json",
            success: function(response) {
                console.log('Type updated for student:', response);
            },
            error: function(error) {
                console.error('Error updating type:', error);
            }
        });
    }
    
});




