import express from 'express'
import dotenv from 'dotenv'
import {connectDB} from './db.js'
import todoRoutes from './routes/todo.route.js'
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())

app.use('/todos', todoRoutes)

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`)
    })
})

