const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const cors = require("cors");
const pool = require("./db");

const port = 5000;

// middleware
app.use(cors());
app.use(express.json());



// ROUTES

// get all todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query(`
      SELECT * FROM todo
    `)
    res.json(allTodos.rows);
  } catch (e) {
    console.error(e.message)
  }
})

// get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const todo = await pool.query(`
      SELECT * FROM todo
      WHERE todo_id = $1
    `, [id])
    res.json(todo.rows[0]);
  } catch (e) {
    console.error(e.message)
  }
})

// create todo
app.post("/todos", async (req, res) => {
  try {
    const {description} = req.body
    const newTodo = await pool.query(`
    INSERT INTO todo (description) VALUES ($1) RETURNING *`,
      [description]);
    // console.log(newTodo)
    res.json(newTodo.rows[0])
  } catch (e) {
    console.error(e.message)
  }
})

// update todo
app.put("/todos/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const {description} = req.body
    const updatedTodo = await pool.query(`
      UPDATE todo 
      SET description = $1
      WHERE todo_id = $2
    `, [description, id])
    res.json(`Updated id no:${id}`);
  } catch (e) {
    console.error(e.message)
  }
})

// delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const deleteTodo = await pool.query(`
      DELETE FROM todo
      WHERE todo_id = $1
    `, [id])
    res.json(`Todo no:${id} was deleted`)
  } catch (e) {
    console.error(e.message)
  }
})


app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`)
})