import { Todo } from '../models/todo.js'
import { fileManager } from '../utils/files.js'

class todoController {
    constructor() {
        //try to get data from file and init tasks array
        this.initTodos()
    }

    async createTodo(req,res) {
        //get data from POST request
        const task = req.body.task
        //create new object via Todo model
        //model constructor uses unique id and task name as parameter
        const newTodo = new Todo(Math.random().toString(), task)
        //add new Todo to todos array
        this.TODOS.push(newTodo)
        //save data to file
        await fileManager.writeFile('./data/todos.json', this.TODOS)
        //create a correct response
        res.json({
            message: 'created new todo object',
            newTask: newTodo
        })
    }

    async initTodos() {
        const todosData = await fileManager.readFile('./data/todos.json')
        //if file is ok, add file data to array
        if(todosData !== null) {
            this.TODOS = todosData
        } else {
            this.TODOS = []
        }
    }

    getTodos(req, res) {
        res.json({tasks: this.TODOS})
    }

    updateTodo(req, res) {
        const todoId = req.params.id
        const updatedTask = req.body.task

        console.log(req.body)
        console.log(req.params)

        const todoIndex = this.TODOS.findIndex((todo) => todo.id === todoId)

        if(todoIndex < 0) {
            res.json({
                message: 'Could not find such index'
            })
            throw new Error('Could not find todo')
        }

        this.TODOS[todoIndex] = new Todo(this.TODOS[todoIndex].id, updatedTask)
        res.json({
            message: 'todo is updated',
            updatedTask: this.TODOS[todoIndex]
        })
    }

    deleteTodo(req,res) {
        const todoId = req.params.id

        console.log(req.params)

        const todoIndex = this.TODOS.findIndex((todo) => todo.id === todoId)

        if(todoIndex < 0) {
            res.json({
                message: 'Could not find such index'
            })
            throw new Error('Could not find todo')
        }

        this.TODOS.splice(todoIndex, 1)
        res.json({
            message: 'todo is deleted'
        })
    }
}

export const TodoController = new todoController()