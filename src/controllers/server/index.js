import { Router } from "express"
import userRouter from './users'
import tokenRouter from './token'
import todoRouter from './todos'
import taskRouter from './tasks'

const router = Router()

router.use('/users', userRouter)
router.use(tokenRouter)
router.use('/todos', todoRouter)
router.use('/tasks', taskRouter)

export default router