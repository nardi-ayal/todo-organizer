// ==========================================
// GET HTML ELEMENTS
// ==========================================

const folderInput = document.getElementById("folderInput");

const createFolderBtn =
    document.getElementById("createFolderBtn");

const foldersContainer =
    document.getElementById("foldersContainer");


// ==========================================
// FOLDERS DATA
// ==========================================

let folders = [];


// ==========================================
// CREATE FOLDER
// ==========================================

createFolderBtn.addEventListener("click", async function () {

    const folderName =
        folderInput.value.trim();

    if (folderName === "") {

        alert("Please enter a folder name.");

        return;
    }

    await fetch(
        "http://localhost:3000/api/folders",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: folderName
            })
        }
    );

    folderInput.value = "";

    alert("Folder created successfully!");

    await getFoldersFromBackend();

});


// ==========================================
// CREATE FOLDER USING ENTER KEY
// ==========================================

folderInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        createFolderBtn.click();

    }

});


// ==========================================
// GET FOLDERS FROM BACKEND
// ==========================================

async function getFoldersFromBackend() {

    const response = await fetch(
        "http://localhost:3000/api/folders"
    );

    const foldersFromDatabase =
        await response.json();

    folders = [];

    for (let folder of foldersFromDatabase) {

        const subfolderResponse =
            await fetch(
                `http://localhost:3000/api/subfolders/${folder.id}`
            );

        const subfoldersFromDatabase =
            await subfolderResponse.json();

        folder.subfolders = [];

        for (let subfolder of subfoldersFromDatabase) {

            const taskResponse =
                await fetch(
                    `http://localhost:3000/api/tasks/${subfolder.id}`
                );

            const tasksFromDatabase =
                await taskResponse.json();

            subfolder.tasks =
                tasksFromDatabase;

            folder.subfolders.push(
                subfolder
            );

        }

        folders.push(folder);

    }

    displayFolders();

}


// ==========================================
// DISPLAY FOLDERS
// ==========================================

function displayFolders() {

    foldersContainer.innerHTML = "";

    if (folders.length === 0) {

        foldersContainer.innerHTML = `

            <div class="empty-message">

                No folders yet.
                Create your first folder!

            </div>

        `;

        return;

    }

    folders.forEach(function (folder) {

        const folderElement =
            document.createElement("div");

        folderElement.className = "folder";

        folderElement.innerHTML = `

            <div class="folder-header">

                <div class="folder-name">

                    📁 ${folder.name}

                </div>

                <div class="folder-buttons">

                    <button
                        class="add-subfolder-btn"
                        onclick="addSubfolder(${folder.id})">

                        + Subfolder

                    </button>

                    <button
                        class="delete-folder-btn"
                        onclick="deleteFolder(${folder.id})">

                        Delete

                    </button>

                </div>

            </div>

            <div
                class="subfolders"
                id="subfolders-${folder.id}">

            </div>

        `;

        foldersContainer.appendChild(
            folderElement
        );

        displaySubfolders(folder);

    });

}


// ==========================================
// ADD SUBFOLDER
// ==========================================

async function addSubfolder(folderId) {

    const subfolderName =
        prompt("Enter subfolder name:");

    if (subfolderName === null) {

        return;

    }

    if (subfolderName.trim() === "") {

        alert("Subfolder name cannot be empty.");

        return;

    }

    await fetch(
        "http://localhost:3000/api/subfolders",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                folder_id: folderId,
                name: subfolderName.trim()
            })
        }
    );

    await getFoldersFromBackend();

}


// ==========================================
// DISPLAY SUBFOLDERS
// ==========================================

function displaySubfolders(folder) {

    const subfolderContainer =
        document.getElementById(
            `subfolders-${folder.id}`
        );

    folder.subfolders.forEach(
        function (subfolder) {

            const subfolderElement =
                document.createElement("div");

            subfolderElement.className =
                "subfolder";

            subfolderElement.innerHTML = `

                <div class="subfolder-header">

                    <div class="subfolder-name">

                        📂 ${subfolder.name}

                    </div>

                    <div class="subfolder-buttons">

                        <button
                            class="add-task-btn"
                            onclick="
                                addTask(
                                    ${folder.id},
                                    ${subfolder.id}
                                )
                            ">

                            + Task

                        </button>

                        <button
                            class="delete-subfolder-btn"
                            onclick="
                                deleteSubfolder(
                                    ${folder.id},
                                    ${subfolder.id}
                                )
                            ">

                            Delete

                        </button>

                    </div>

                </div>

                <div
                    class="tasks"
                    id="tasks-${subfolder.id}">

                </div>

            `;

            subfolderContainer.appendChild(
                subfolderElement
            );

            displayTasks(subfolder);

        }
    );

}


// ==========================================
// ADD TASK
// ==========================================

async function addTask(folderId, subfolderId) {

    const taskName =
        prompt("Enter task name:");

    if (taskName === null) {

        return;

    }

    if (taskName.trim() === "") {

        alert("Task name cannot be empty.");

        return;

    }

    await fetch(
        "http://localhost:3000/api/tasks",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                subfolder_id: subfolderId,
                title: taskName.trim()
            })
        }
    );

    await getFoldersFromBackend();

}


// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks(subfolder) {

    const taskContainer =
        document.getElementById(
            `tasks-${subfolder.id}`
        );

    subfolder.tasks.forEach(
        function (task) {

            const taskElement =
                document.createElement("div");

            taskElement.className = "task";

            if (task.completed) {

                taskElement.classList.add(
                    "completed"
                );

            }

            taskElement.innerHTML = `

                <div class="task-left">

                    <input
                        type="checkbox"
                        class="task-checkbox"

                        ${task.completed
                            ? "checked"
                            : ""
                        }

                        onchange="
                            toggleTask(
                                ${subfolder.id},
                                ${task.id}
                            )
                        "
                    >

                    <span class="task-title">

                        ${task.title}

                    </span>

                </div>

                <button
                    class="delete-task-btn"
                    onclick="
                        deleteTask(
                            ${subfolder.id},
                            ${task.id}
                        )
                    ">

                    Delete

                </button>

            `;

            taskContainer.appendChild(
                taskElement
            );

        }
    );

}


// ==========================================
// COMPLETE / UNCOMPLETE TASK
// ==========================================

async function toggleTask(
    subfolderId,
    taskId
) {

    let currentTask;

    for (let folder of folders) {

        const subfolder =
            folder.subfolders.find(
                function (subfolder) {

                    return subfolder.id === subfolderId;

                }
            );

        if (subfolder) {

            currentTask =
                subfolder.tasks.find(
                    function (task) {

                        return task.id === taskId;

                    }
                );

            break;

        }

    }

    if (!currentTask) {

        return;

    }

    await fetch(
        `http://localhost:3000/api/tasks/${taskId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                completed: !currentTask.completed
            })
        }
    );

    await getFoldersFromBackend();

}


// ==========================================
// DELETE TASK
// ==========================================

async function deleteTask(
    subfolderId,
    taskId
) {

    await fetch(
        `http://localhost:3000/api/tasks/${taskId}`,
        {
            method: "DELETE"
        }
    );

    await getFoldersFromBackend();

}


// ==========================================
// DELETE SUBFOLDER
// ==========================================

async function deleteSubfolder(
    folderId,
    subfolderId
) {

    await fetch(
        `http://localhost:3000/api/subfolders/${subfolderId}`,
        {
            method: "DELETE"
        }
    );

    await getFoldersFromBackend();

}


// ==========================================
// DELETE FOLDER
// ==========================================

async function deleteFolder(folderId) {

    await fetch(
        `http://localhost:3000/api/folders/${folderId}`,
        {
            method: "DELETE"
        }
    );

    await getFoldersFromBackend();

}


// ==========================================
// START APPLICATION
// ==========================================

getFoldersFromBackend();