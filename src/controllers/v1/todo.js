import { Router } from 'express';
import models from '../../models';
import asyncWrapper from '../../utils/asyncWrapper';
import JWTUtils from '../../utils/jwt-utils';
import requiresAuth from '../../middlewares/requiresAuth';

const router = Router();
const { TodoList, Task } = models;

router.post('/all', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId } } = req.body;
    const todo = await TodoList.findAll({ where: { UserId } })
    return res.status(200).send({ success: true, data: todo })
}))

router.post('/create', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId }, name } = req.body;
    const todo = await TodoList.findOne({ where: { name, UserId } })
    if (todo) {
        return res.status(401).send({ success: false, message: 'TodoList name already exists, please chose another name' })
    }
    await TodoList.create({ name, UserId })
    return res.status(200).send({ success: true, message: 'Added successfully' })
}))

router.post('/detail', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId }, id } = req.body;
    const todo = await TodoList.findOne({ where: { id, UserId } })
    const task = await Task.findAll({ where: { TodoListId: id } })
    if (!todo) {
        return res.status(401).send({ success: false, message: 'Todolist not found' })
    }
    return res.status(200).send({ success: true, data: { todo, task } })
}))

router.post('/update', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId }, id, name } = req.body;
    const todo = await TodoList.findOne({ where: { id, UserId } })
    if (!todo) {
        return res.status(401).send({ success: false, message: 'Todolist not found' })
    }
    await todo.update({ name })
    return res.status(200).send({ success: true, message: 'Updated successfully' })
}))
router.post('/delete', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { id: UserId }, id } = req.body;
    const todo = await TodoList.findOne({ where: { id, UserId } })
    if (!todo) {
        return res.status(401).send({ success: false, message: 'Todolist not found' })
    }
    await todo.destroy()
    return res.status(200).send({ success: true, message: 'Deleted successfully' })
}))

export default router