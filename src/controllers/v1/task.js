import { Router } from 'express';
import models from '../../models';
import asyncWrapper from '../../utils/asyncWrapper';
import JWTUtils from '../../utils/jwt-utils';
import requiresAuth from '../../middlewares/requiresAuth';

const router = Router();
const { TodoList, Task } = models;

router.post('/create', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId }, content, TodoListId } = req.body;
    const todo = await TodoList.findOne({ where: { id: TodoListId, UserId } })
    console.log('todo ', !todo)
    if (!todo) {
        return res.status(403).send({ success: false, message: 'You do not have permission to access this todolist' })
    }
    await Task.create({ content, TodoListId })
    return res.status(200).send({ success: true, message: 'Added successfully' })
}))

router.post('/update', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId }, id, content, TodoListId } = req.body;
    const todo = await TodoList.findOne({ where: { id: TodoListId, UserId } })
    if (!todo) {
        return res.status(403).send({ success: false, message: 'You do not have permission to access this todolist' })
    }
    const task = await Task.findOne({ where: { id, TodoListId } })
    if (!task) {
        return res.status(401).send({ success: false, message: 'Task not found' })
    }
    await task.update({ content })
    return res.status(200).send({ success: true, message: 'Updated successfully' })
}))
router.post('/delete', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId }, id, TodoListId } = req.body;
    const todo = await TodoList.findOne({ where: { id: TodoListId, UserId } })
    if (!todo) {
        return res.status(403).send({ success: false, message: 'You do not have permission to access this todolist' })
    }
    const task = await Task.findOne({ where: { id, TodoListId } })
    if (!task) {
        return res.status(401).send({ success: false, message: 'Task not found' })
    }
    await task.destroy()
    return res.status(200).send({ success: true, message: 'Deleted successfully' })
}))

export default router