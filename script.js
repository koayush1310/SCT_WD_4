const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskTime = document.getElementById("task-time");
const taskPriority = document.getElementById("task-priority");

const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const pendingCount = document.getElementById("pending-count");

const filterButtons =
    document.querySelectorAll(".filter-btn");

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

let currentFilter = "all";

/* =====================
   Save Tasks
===================== */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* =====================
   Dashboard
===================== */

function updateDashboard() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const pending =
        total - completed;

    totalCount.textContent =
        total;

    completedCount.textContent =
        completed;

    pendingCount.textContent =
        pending;
}

/* =====================
   Render Tasks
===================== */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "completed") {

        filteredTasks =
            tasks.filter(
                task => task.completed
            );

    } else if (
        currentFilter === "pending"
    ) {

        filteredTasks =
            tasks.filter(
                task => !task.completed
            );
    }

    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");

        li.className =
            `task-item ${
                task.completed
                    ? "completed"
                    : ""
            }`;

        li.innerHTML = `
            <div class="task-info">

                <div class="task-title">
                    ${task.title}
                </div>

                <div class="task-details">
                    📅 ${task.date || "No Date"}
                    |
                    ⏰ ${task.time || "No Time"}
                </div>

                <span class="
                    priority
                    ${task.priority.toLowerCase()}
                ">
                    ${task.priority}
                </span>

            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleComplete(${task.id})">

                    <i class="fas fa-check"></i>

                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">

                    <i class="fas fa-pen"></i>

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">

                    <i class="fas fa-trash"></i>

                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    updateDashboard();
}

/* =====================
   Add Task
===================== */

addTaskBtn.addEventListener(
    "click",
    addTask
);

function addTask() {

    const title =
        taskInput.value.trim();

    if (!title) {

        alert(
            "Please enter a task."
        );

        return;
    }

    const task = {

        id: Date.now(),

        title,

        date: taskDate.value,

        time: taskTime.value,

        priority:
            taskPriority.value,

        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
}

/* =====================
   Complete Task
===================== */

function toggleComplete(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed =
                !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

/* =====================
   Delete Task
===================== */

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Delete this task?"
        );

    if (!confirmDelete)
        return;

    tasks =
        tasks.filter(
            task => task.id !== id
        );

    saveTasks();
    renderTasks();
}

/* =====================
   Edit Task
===================== */

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );

    const newTitle =
        prompt(
            "Edit Task",
            task.title
        );

    if (
        newTitle === null ||
        newTitle.trim() === ""
    ) {
        return;
    }

    task.title =
        newTitle.trim();

    saveTasks();
    renderTasks();
}

/* =====================
   Filters
===================== */

filterButtons.forEach(btn => {

    btn.addEventListener(
        "click",
        () => {

            filterButtons.forEach(
                button =>
                    button.classList.remove(
                        "active"
                    )
            );

            btn.classList.add(
                "active"
            );

            currentFilter =
                btn.dataset.filter;

            renderTasks();
        }
    );
});

/* =====================
   Enter Key Support
===================== */

taskInput.addEventListener(
    "keypress",
    e => {

        if (e.key === "Enter") {

            addTask();
        }
    }
);

/* =====================
   Initial Render
===================== */

renderTasks();