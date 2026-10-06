const express = require("express");
const cors= require("cors");
const db = require("./db");

const app = express();

const PORT = 3000;


// Allow the server to receive JSON data
app.use(express.json());
app.use(cors());

// ===============================
// TEST ROUTE
// ===============================

app.get("/", function (req, res) {

    res.send("To-Do Organizer backend is running!");

});


// ===============================
// GET FOLDERS API
// ===============================
app.get("/api/folders", function (req, res) {
    const sql = "SELECT * FROM folders";

    db.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to get folders"
            });
        }

        res.json(results);
    });
});
// ===============================
// GET SUBFOLDERS API
// ===============================
app.get("/api/subfolders/:folderId", function (req, res) {

    const folderId = req.params.folderId;

    const sql = "SELECT * FROM subfolders WHERE folder_id = ?";

    db.query(sql, [folderId], function (error, results) {

        if (error) {
            console.log(error);

            return res.status(500).json({
                message: "Failed to get subfolders"
            });
        }

        res.json(results);
    });
});
// ===============================
// GET TASKS API
// ===============================
app.get("/api/tasks/:subfolderId", function (req, res) {

    const subfolderId = req.params.subfolderId;

    const sql = "SELECT * FROM tasks WHERE subfolder_id = ?";

    db.query(sql, [subfolderId], function (error, results) {

        if (error) {
            console.log(error);

            return res.status(500).json({
                message: "Failed to get tasks"
            });
        }

        res.json(results);
    });
});
// ===============================
// CREATE SUBFOLDER API
// ===============================
app.post("/api/subfolders", function (req, res) {

    const folderId = req.body.folder_id;
    const subfolderName = req.body.name;

    const sql = "INSERT INTO subfolders (folder_id, name) VALUES (?, ?)";

    db.query(sql, [folderId, subfolderName], function (error, result) {

        if (error) {
            console.log(error);

            return res.status(500).json({
                message: "Failed to create subfolder"
            });
        }

        res.json({
            message: "Subfolder created successfully!",
            subfolder: {
                id: result.insertId,
                folder_id: folderId,
                name: subfolderName
            }
        });
    });
});
// ===============================
// CREATE TASK API
// ===============================
app.post("/api/tasks", function (req, res) {

    const subfolderId = req.body.subfolder_id;
    const taskTitle = req.body.title;

    const sql = "INSERT INTO tasks (subfolder_id, title, completed) VALUES (?, ?, FALSE)";

    db.query(sql, [subfolderId, taskTitle], function (error, result) {

        if (error) {
            console.log(error);

            return res.status(500).json({
                message: "Failed to create task"
            });
        }

        res.json({
            message: "Task created successfully!",
            task: {
                id: result.insertId,
                subfolder_id: subfolderId,
                title: taskTitle,
                completed: false
            }
        });
    });
});
// ===============================
// DELETE FOLDER API
// ===============================
app.delete("/api/folders/:id", function (req, res) {

    const folderId = req.params.id;

    const sql = "DELETE FROM folders WHERE id = ?";

    db.query(sql, [folderId], function (error) {

        if (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to delete folder"
            });
        }

        res.json({
            message: "Folder deleted successfully!"
        });
    });
});

// ===============================
// DELETE SUBFOLDER API
// ===============================
app.delete("/api/subfolders/:id", function (req, res) {

    const subfolderId = req.params.id;

    const sql = "DELETE FROM subfolders WHERE id = ?";

    db.query(sql, [subfolderId], function (error) {

        if (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to delete subfolder"
            });
        }

        res.json({
            message: "Subfolder deleted successfully!"
        });
    });
});
// ===============================
// DELETE TASK API
// ===============================
app.delete("/api/tasks/:id", function (req, res) {

    const taskId = req.params.id;

    const sql = "DELETE FROM tasks WHERE id = ?";

    db.query(sql, [taskId], function (error) {

        if (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to delete task"
            });
        }

        res.json({
            message: "Task deleted successfully!"
        });
    });
});
// ===============================
// UPDATE TASK API
// ===============================
app.put("/api/tasks/:id", function (req, res) {

    const taskId = req.params.id;
    const completed = req.body.completed;

    const sql = "UPDATE tasks SET completed = ? WHERE id = ?";

    db.query(sql, [completed, taskId], function (error) {

        if (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to update task"
            });
        }

        res.json({
            message: "Task updated successfully!"
        });
    });
});

// ===============================
// CREATE FOLDER API
// ===============================
app.post("/api/folders", function (req, res) {
    const folderName = req.body.name;

    const sql = "INSERT INTO folders (name) VALUES (?)";

    db.query(sql, [folderName], function (error, result) {
        if (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to create folder"
            });
        }

        res.json({
            message: "Folder created successfully!",
            folder: {
                id: result.insertId,
                name: folderName
            }
        });
    });
});
// ===============================
// START SERVER
// ===============================

app.listen(PORT, function () {

    console.log(`Server running at http://localhost:${PORT}`);

});