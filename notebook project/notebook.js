let side = document.querySelector(".side");
let hanburger = document.querySelector(".hanburger");
let container = document.querySelector(".container");
let newproject = document.querySelector("#newproject");
let newprojectbtn = document.querySelector("#newprojectbtn");
let sideItem = document.querySelector(".side-item-main");

let SaveData = [];


const savedProjects = localStorage.getItem('projects');
if (savedProjects) {
    SaveData = JSON.parse(savedProjects);
} else {
    SaveData = [];
}

sideadd(SaveData);


function toggle() {
    side.classList.toggle("active");
    if (window.innerWidth < 768) {
        hanburger.classList.toggle("active");
        container.style.opacity = side.classList.contains("active") ? "0.1" : "1";
    }
}
hanburger.addEventListener("click", toggle);


function createNewProject() {
    container.innerHTML = getProjectFormHTML();

    setupProjectFormEvents();
}

function loadProject(index) {
    const project = SaveData[index];
    container.innerHTML = getProjectFormHTML(project);

    const chake = document.getElementById("chake");
    project.todo.forEach(task => {
        const newtasks = document.createElement("div");
        newtasks.innerHTML = `
            <label class="label">
                <input type="checkbox" name="task" value="${task.text}" ${task.completed ? 'checked' : ''} />  ${task.text}
            </label>
        `;
        chake.appendChild(newtasks);
    });

    setupProjectFormEvents(index);
}

function getProjectFormHTML(project = {}) {
    const title = project.title || "";
    const date = project.date || "";
    const description = project.description || "";

    return `
    <div class="ti">
      <div class="out">
        <h2 id="titleOutput">Title: ${title || "xxxx"}</h2>
        <h2 id="dateOutput">Date: ${date || "hhhhh"}</h2>
      </div>
      <div class="inp">
        <input id="titleInput" type="text" placeholder="Title" value="${title}" />
        <input id="dateInput" type="date" placeholder="Date" value="${date}" />
      </div>
      <div class="description">
        <textarea name="description" id="description" cols="70" rows="25" placeholder="Description">${description}</textarea>
      </div>
      <div class="he">
        <h2 class="todo">To-do List</h2>
        <span class="span"></span>
      </div>
      <div class="to">
        <input type="text" id="task" placeholder="Add a new task" />
        <button class="addd" id="add">Add</button>
      </div>
      <div class="chake" id="chake"></div>
      <div class="btn">
        <button class="save" id="saveBtn">Save</button>
        <button class="cancel">Cancel</button>
      </div>
      <div class="dle">
        <button class="delete" id="deleteBtn">Delete</button>
      </div>
    </div>
    `;
}


function setupProjectFormEvents(index = null) {
    const titleInput = document.getElementById("titleInput");
    const dateInput = document.getElementById("dateInput");
    const saveBtn = document.getElementById("saveBtn");
    const addBtn = document.getElementById("add");
    const cancelBtn = document.querySelector(".cancel");
    const deleteBtn = document.getElementById("deleteBtn");

    titleInput.addEventListener("input", updateProject);
    dateInput.addEventListener("input", updateProject);
    saveBtn.addEventListener("click", () => save(index));
    addBtn.addEventListener("click", todoadd);
    cancelBtn.addEventListener("click", () => (container.innerHTML = ""));

    if (index !== null) {
        deleteBtn.style.display = "inline-block";
        deleteBtn.addEventListener("click", () => deleteProject(index));
    } else {
        deleteBtn.style.display = "none";
    }

    updateProject();
}

function updateProject() {
    const titleInput = document.getElementById("titleInput");
    const dateInput = document.getElementById("dateInput");
    const titleOutput = document.getElementById("titleOutput");
    const dateOutput = document.getElementById("dateOutput");

    titleOutput.textContent = `Title: ${titleInput.value || "Untitled"}`;
    dateOutput.textContent = `Date: ${dateInput.value || "Not set"}`;
}

function todoadd() {
    let taskInput = document.getElementById("task");
    let taskValue = taskInput.value.trim();
    let chake = document.getElementById("chake");

    if (taskValue) {
        let newtasks = document.createElement("div");
        newtasks.innerHTML = `
            <label class="label">
                <input type="checkbox" name="task" value="${taskValue}" />  ${taskValue}
            </label>
        `;
        chake.appendChild(newtasks);
        taskInput.value = "";
    }
}

function save(index = null) {
    const titleInput = document.getElementById("titleInput");
    const dateInput = document.getElementById("dateInput");
    const description = document.getElementById("description");
    const chake = document.getElementById("chake");

    if (titleInput && dateInput && description) {
        let titleValue = titleInput.value.trim();
        let dateValue = dateInput.value.trim();
        let descriptionValue = description.value.trim();

        if (titleValue && dateValue && descriptionValue) {
            const project = {
                title: titleValue,
                date: dateValue,
                description: descriptionValue,
                todo: Array.from(chake.children).map(task => ({
                    text: task.querySelector("input").value,
                    completed: task.querySelector("input").checked
                }))
            };

            if (index !== null) {
                SaveData[index] = project;
            } else {
                SaveData.unshift(project); 
            }

            localStorage.setItem('projects', JSON.stringify(SaveData));
            sideadd(SaveData);
            alert("Project saved successfully!");
            container.innerHTML = "";
        } else {
            alert("Please fill in all fields before saving.");
        }
    }
}


function deleteProject(index) {
    if (confirm("Are you sure you want to delete this project?")) {
        SaveData.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(SaveData));
        sideadd(SaveData);
        container.innerHTML = "";
    }
}


function sideadd(data) {
    sideItem.innerHTML = "";
    if (data.length === 0) {
        sideItem.innerHTML = "<p>No projects available</p>";
        return;
    }

    data.forEach((project, index) => {
        const Item = document.createElement("div");
        Item.classList.add("side-item");
        Item.innerHTML = `<h3>${project.title}</h3>`;
        Item.addEventListener("click", () => loadProject(index));
        sideItem.appendChild(Item);
    });
}


newproject.addEventListener("click", createNewProject);
newprojectbtn.addEventListener("click", createNewProject);
