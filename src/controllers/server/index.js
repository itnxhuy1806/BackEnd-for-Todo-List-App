import { Router } from "express"
import userRouter from './user'
import tokenRouter from './token'
import todoRouter from './todo'
import taskRouter from './task'

const router = Router()

router.use('/user', userRouter)
router.use(tokenRouter)
router.use('/todo', todoRouter)
router.use('/task', taskRouter)

export default router