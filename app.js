const express = require("express");
const bodyParser= require('body-parser');
const cors = require('cors');
const dotenv= require('dotenv');
const mongoose = require("mongoose");
const app = express();
const TodoTask =require('./models/TodoTask');
app.set("view engine","ejs");
app.use(bodyParser.json());
app.use("/static",express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
});
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
});
app
.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
}).post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
    });
});

app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
});
    
const connectDB = require("./config/db");
dotenv.config({path: './config/config.env'});
connectDB();
app.listen(3000)
