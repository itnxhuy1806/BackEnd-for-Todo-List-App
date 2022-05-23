import { Router } from 'express';
import models from '../../models';
import asyncWrapper from '../../utils/asyncWrapper';
import requiresAuth from '../../middlewares/requiresAuth';

const router = Router();
const { TodoList, Task } = models;

router.post('/create', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId }, content, TodoListId } = req.body;
    const todo = await TodoList.findOne({ where: { id: TodoListId, UserId } })
    if (!todo) {
        return res.status(403).send({ success: false, message: 'You do not have permission to access this todolist' })
    }
    Task.create({ content, TodoListId, checked: false })
    return res.status(200).send({ success: true, message: 'Added successfully' })
}))

router.get('/detail/:id', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId } } = req.body;
    const id = req.params.id
    const task = await Task.findOne({ where: { id } })
    return res.status(200).send({ success: true, data: task })
}))

router.patch('/update/:id', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId } } = req.body;
    const id = req.params.id
    const todo = await TodoList.findOne({ where: { UserId } })
    if (!todo)
        return res.status(403).send({ success: false, message: 'You do not have permission to access this todolist' })
    const task = await Task.findOne({ where: { id } })
    let { content, checked, description } = req.body
    content = content !== undefined ? content : task.content
    checked = checked !== undefined ? checked : task.checked
    description = description !== undefined ? description : task.description
    if (!task)
        return res.status(401).send({ success: false, message: 'Task not found' })
    await task.update({ content, checked, description })
    return res.status(200).send({ success: true, message: 'Updated successfully' })
}))
router.delete('/delete/:id', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId } } = req.body;
    const id = req.params.id
    const task = await Task.findOne({ where: { id } })
    if (!task)
        return res.status(401).send({ success: false, message: 'Task not found' })
    const todo = await TodoList.findOne({ where: { id: task.TodoListId, UserId } })
    if (!todo)
        return res.status(403).send({ success: false, message: 'You do not have permission to access this todolist' })
    await task.destroy()
    return res.status(200).send({ success: true, message: 'Deleted successfully' })
}))

export default router