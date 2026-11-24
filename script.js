
function signup() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    if (email === "" || password === "") {
        document.getElementById("authMessage").innerText =
            "Please enter email and password.";
        return;
    }

    if (password.length < 6) {
        document.getElementById("authMessage").innerText =
            "Password must be at least 6 characters.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let existingUser = users.find(user => user.email === email);

    if (existingUser) {
        document.getElementById("authMessage").innerText =
            "Account already exists. Please login.";
        return;
    }

    users.push({ email: email, password: password });

    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("authMessage").innerText =
        "Signup successful! Please login.";
}

function login() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(
        user => user.email === email && user.password === password
    );

    if (user) {
        localStorage.setItem("currentUser", email);
        showTasks();
    } else {
        document.getElementById("authMessage").innerText =
            "Invalid email or password.";
    }
}

function showTasks() {
    let email = localStorage.getItem("currentUser");

    if (!email) {
        return;
    }

    document.getElementById("authSection").classList.add("hidden");
    document.getElementById("taskSection").classList.remove("hidden");
    document.getElementById("welcome").innerText =
        "Welcome, " + email;

    displayTasks();
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task.");
        return;
    }

    let email = localStorage.getItem("currentUser");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

    if (!tasks[email]) {
        tasks[email] = [];
    }

    tasks[email].push({
        name: taskName,
        completed: false
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    displayTasks();
}

function displayTasks() {
    let email = localStorage.getItem("currentUser");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let userTasks = tasks[email] || [];

    userTasks.forEach((task, index) => {
        let li = document.createElement("li");

        let taskText = document.createElement("span");
        taskText.textContent = task.name;

        if (task.completed) {
            taskText.classList.add("completed");
        }

        let completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Undo" : "Complete";
        completeButton.onclick = function () {
            toggleTask(index);
        };

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
            deleteTask(index);
        };

        li.appendChild(taskText);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

function toggleTask(index) {
    let email = localStorage.getItem("currentUser");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

    tasks[email][index].completed =
        !tasks[email][index].completed;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

function deleteTask(index) {
    let email = localStorage.getItem("currentUser");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

    tasks[email].splice(index, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

function logout() {
    localStorage.removeItem("currentUser");

    document.getElementById("taskSection").classList.add("hidden");
    document.getElementById("authSection").classList.remove("hidden");
}

window.onload = function () {
    if (localStorage.getItem("currentUser")) {
        showTasks();
    }
};
