const students = [];
const rollNum = new Set();


function loadStudentsFromStorage() {
    const stored = localStorage.getItem("students");
    if (stored) {
        const data = JSON.parse(stored);
        data.forEach(student => {
            students.push(new Student(student.name, student.roll, student.marks, student.course));
            rollNum.add(student.roll);
        });
    }
}

class Student {
    constructor(name, roll, marks, course, status) {
        this.name = name;
        this.roll = roll;
        this.marks = marks;
        this.course = course;
        this.status = status;
        if (marks <= 100 && marks >= 40) {
            this.status = "Pass";
        } else {
            this.status = "Fail";
        }
    }

    addStudent() {
        students.push(this);
    }
}

// let s1 = new Student("abc", 1, 90, "MCA");
// s1.addStudent();
// console.log(s1);
// let s2 = new Student("def", 2, 95, "MCA");
// s2.addStudent();
// console.log(students);

function showTotalStudents(students) {
    return students.length;
}
// console.log(showTotalStudents(students));

function deleteStudent(roll) {
    const index = students.findIndex(student => student.roll === roll);
    if (index !== -1) {
        students.splice(index, 1);
        console.log(`Student with roll number ${roll} has been deleted.`);
    } else {
        console.log(`Student with roll number ${roll} not found.`);
    }
}

// console.log(deleteStudent(2));
// console.log(students);


document.getElementById("studentForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const roll = parseInt(document.getElementById("roll").value);
    const marks = parseInt(document.getElementById("marks").value);
    const course = document.getElementById("course").value;

    if (!name || !roll || !marks || !course) {
        alert("Please fill all the fields");
        return;
    }
    if(rollNum.has(roll)) return alert("Roll number must be unique");
    if (isNaN(roll) || roll <= 0) {
        alert("Roll number must be a number and greater than 0");
        return;
    }
    if (isNaN(marks) || marks < 0 || marks > 100) {
        alert("Marks must be a number between 0 and 100");
        return;
    }

    const newStudent = new Student(name, roll, marks, course);
    newStudent.addStudent();
    rollNum.add(roll);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
    document.getElementById("studentForm").reset();
});
let showTotalBtn = document.getElementById("showTotal");
showTotalBtn.addEventListener("click", function() {
    const total = showTotalStudents(students);
    showTotalBtn.innerHTML = `Total Students is ${total}`;
});

document.getElementById("deleteBtn").addEventListener("click", function() {
    const roll = parseInt(document.getElementById("deleteRoll").value);
    if (isNaN(roll)) {
        alert("Please enter a valid roll number");
        return;
    }
    deleteStudent(roll);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
    document.getElementById("deleteRoll").value = "";
});

function displayStudents() {
    const tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";
    
    if (students.length === 0) {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = "No students found";
        row.cells[0].colSpan = 6;
        row.cells[0].style.textAlign = "center";
        row.cells[0].style.color = "#999";
        row.cells[0].style.fontStyle = "italic";
        return;
    }
    
    students.forEach((student, index) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = student.name;
        row.insertCell(1).textContent = student.roll;
        row.insertCell(2).textContent = student.marks;
        row.insertCell(3).textContent = student.course;
        row.insertCell(4).textContent = student.status;
        
        const actionsCell = row.insertCell(5);
        const updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.className = "btn-update";
        updateBtn.onclick = () => updateStudent(index);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "btn-delete";
        deleteBtn.onclick = () => deleteStudentByIndex(index);
        
        actionsCell.appendChild(updateBtn);
        actionsCell.appendChild(deleteBtn);
    });
}

function deleteStudentByIndex(index) {
    if (confirm(`Are you sure you want to delete ${students[index].name}?`)) {
        students.splice(index, 1);
        localStorage.setItem("students", JSON.stringify(students));
        displayStudents();
    }
}

function updateStudent(index) {
    const student = students[index];
    const name = prompt("Enter new name:", student.name);
    if (name === null) return;
    
    const roll = prompt("Enter new roll number:", student.roll);
    if (roll === null) return;
    
    const marks = prompt("Enter new marks:", student.marks);
    if (marks === null) return;
    
    const course = prompt("Enter new course:", student.course);
    if (course === null) return;
    
    if (!name || !roll || marks === null || !course) {
        alert("Please fill all fields");
        return;
    }
    
    const marksNum = parseInt(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
        alert("Marks must be a number between 0 and 100");
        return;
    }
    
    student.name = name;
    student.roll = parseInt(roll);
    student.marks = marksNum;
    student.course = course;
    
    if (marksNum >= 40 && marksNum <= 100) {
        student.status = "Pass";
    } else {
        student.status = "Fail";
    }
    
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
}


loadStudentsFromStorage();
displayStudents();

