import {z} from 'zod';

export const mongoDBObjectIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB Object")
})

export const createTodoSchema = z.object({
    title: z.string().trim().min(3, "Title must be atlease 3 characters").max(30, "Title cannot exceed 30 characters"),
    description: z.string().trim().min(5, "Description must be atleast 5 characters").max(100, "Description cannot exceed 100 characters").optional()
})

export const updateTodoSchema = createTodoSchema.extend({
    description: z.string().trim().min(5, "Description must be atleast 5 characters").max(100, "Description cannot exceed 100 characters")
})

export const queryTodoSchema = z.object({
    completed: z.enum(["true", "false"]).optional(),
    search: z.string().max(30).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
})
