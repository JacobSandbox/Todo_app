import express from "express";
import bodyParser from "body-parser";

// Globals
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Vars
var tasks = [];
var backupTasks = [];
var isMainList = true;

// Functions
function addTask(txt) {
    tasks.push(txt);
}

function contains(arr, val) {
    for (let item of arr) {
        if ( item == val ) return true;
    }
    return false;
}

function removeTasks(indexes) {
    let newList = [];
    for ( let i = 0; i < tasks.length; i++ ) {
        if ( !contains(indexes, i) ) {
            newList.push(tasks[i]);
        }
    }
    return newList;
}

function swapTaskLists() {
    let temp = backupTasks;
    backupTasks = tasks;
    tasks = temp;
    isMainList = !isMainList;
}

// Server
app.get("/", (req, res) => {
    let title = isMainList ? "Daily list" : "Work list";
    res.render("./index.ejs", {taskList: tasks, listTitle: title});
});

app.get("/swap", (req, res) => {
    // Swap task lists and rerender main page
    swapTaskLists();
    res.redirect("/");
});

app.post("/submit", (req, res) => {
    // Add task and rerender main page
    if ( req.body["task"].length > 0 ) {
        addTask(req.body["task"]);
    }
    res.redirect("/");
});

app.post("/remove", (req, res) => {
    // Remove checked items and rerender
    let toRemove = [];
    for ( let box of Object.keys(req.body) ) {
        if ( req.body[box] == "on" ) {
            let index = Number(box.split(".")[1]);
            toRemove.push(index);
        }
    }

    if ( toRemove.length > 0 ) {
        tasks = removeTasks(toRemove);
    }

    res.redirect("/");
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});