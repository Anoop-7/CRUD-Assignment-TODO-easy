import {Router} from 'express';
import {Todo} from '../models/todo.model.js'
import {
    mongoDBObjectIdSchema,
    createTodoSchema,
    updateTodoSchema,
    queryTodoSchema
} from '../schemas/todo.schema.js'

const router = Router();

router.post('/', async(req, res)=>{
    try{
        const parseResult = createTodoSchema.safeParse(req.body)
        if(!parseResult.success){
            console.log(parseResult.error.issues[0].message)
            return res.status(400).json({
                message: "Error while creating new todo",
                data:{
                    "error": "Validation failed",
                    "details": [{
                        "field": parseResult.error.issues[0].path[0],
                        "message": parseResult.error.issues[0].message
                    }]
                }
            })
        }
        const {title, description} = parseResult.data
        let newTodo = await Todo.create({
            title: title,
            description: description ||"",
            completed: false
        })
        return res.status(201).json({
            message: "TODO created successfully",
            todo: newTodo
        })
    } catch(e){
        console.log("error",e)
        return res.status(500).json({
            message: "Internal server error",
            data: {error: e} 
        })
    }
})

router.get('/', async (req,res)=>{
    try{
        const queryResult = queryTodoSchema.safeParse(req.query)
        if(!queryResult.success){
            console.log(queryResult.error.issues[0].message)
            return res.status(400).json({
                error: "Invalid Query Parameters",
                details: queryResult.error.issues
            })
        }
        const {completed, search, page, limit} = queryResult.data
        const filter = {}

        if(completed !== undefined){
            filter.completed = completed === "true"  
        }
        if(search !== undefined && search.trim() !== ""){
            filter.title = {$regex: search.trim(), $options: 'i'}
        }

        const skip = (page-1)*limit;
        const [todos, total] = await Promise.all([
            Todo.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit),
            Todo.countDocuments(filter)
        ])

        const totalPages = Math.ceil(total/limit)
        return res.status(200).json({
            todos,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    }catch(error){
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/:id', async(req, res)=>{
    try {
        const paramResult = mongoDBObjectIdSchema.safeParse(req.params)
        if(!paramResult.success){
            return res.status(400).json({
                error: "Invalid MongoDB Object"
            })  
        }
        const todo = await Todo.findById(paramResult.data.id)
        if(!todo){
            return res.status(404).json({error: "TODO not found"})
        }

        return res.status(200).json({todo});
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.put('/:id', async(req, res)=>{
    try {
        const paramResult = mongoDBObjectIdSchema.safeParse(req.params)
        if(!paramResult.success){
            return res.status(400).json({ error: "Invalid MongoDB ObjectId" });
        }
        const bodyResult = updateTodoSchema.safeParse(req.body)
        if(!bodyResult.success){
            console.log(bodyResult.error)
            return res.status(400).json({
                error: "Validation Failed",
                details: {
                    field: bodyResult.error.issues[0].path[0],
                    message: bodyResult.error.issues[0].message
                }
            })
        }
        const {title, description} = bodyResult.data

        const updatedTodo = await Todo.findByIdAndUpdate(
            paramResult.data.id, 
            {title, description}, 
            {new: true, runValidators: true}
        )
        if(!updatedTodo){
            return res.status(404).json({ error: "TODO not found" });
        }

        return res.status(200).json({
            message: "TODO updated successfully",
            todo: updatedTodo
        })
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.patch('/:id/toggle', async(req, res)=>{
    try {
        const paramResult = mongoDBObjectIdSchema.safeParse(req.params)
        if(!paramResult.success){
            return res.status(400).json({ error: "Invalid MongoDB ObjectId" });
        }
        const todo = await Todo.findById(paramResult.data.id)
        if(!todo){
            return res.status(404).json({error: "TODO not found"})
        }
        
        todo.completed = !todo.completed
        await todo.save();

        return res.status(200).json({
            message: "TODO status toggled successfully",
            todo
        })

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }    
})

router.delete('/:id', async(req, res)=>{
    try {
        const paramResult = mongoDBObjectIdSchema.safeParse(req.params)
        if(!paramResult.success){
            return res.status(400).json({
                error: "Invalid MongoDB Object"
            })
        }
        const deleteTodo = await Todo.findByIdAndDelete(paramResult.data.id);
        if(!deleteTodo){
            return res.status(404).json({error: "TODO not found"})
        }
        return res.status(200).json({message: "TODO deleted successfully"})
    } catch (error) {
        return res.status(500).json({error: "Internal server error"})
    }
})

export default router;