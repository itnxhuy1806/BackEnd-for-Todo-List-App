import { Router } from 'express'
import axios from 'axios'
const router = Router()

router.get('/', (req, res) => {
    return res.render('home')
})
router.get('/register', (req, res) => {
    return res.render('register')
})
router.get('/login', (req, res) => {
    return res.render('login')
})
router.get('/todo/:id', (req, res) => {
    return res.render('todo', {data: req.params.id})
 })

export default router;