import { Router } from 'express';
import models from '../../models';
import asyncWrapper from '../../utils/asyncWrapper';
import JWTUtils from '../../utils/jwt-utils';
import requiresAuth from '../../middlewares/requiresAuth';

const router = Router();
const { User, RefreshToken } = models;

router.post('/token', requiresAuth('refreshToken'), asyncWrapper(async (req, res) => {
    const { jwt:{id},jwt } = req.body;
    const user = await User.findOne({ where: { id}, include: RefreshToken })
    const savedToken = user.RefreshToken
    if (!savedToken || !savedToken.token) {
        return res.status(401).send({ success: false, message: 'You must login in first' })
    }
    const payload = {...jwt}
    delete payload.iat
    console.log(payload)
    const newAccessToken = JWTUtils.generateAccessToken(payload)
    return res.status(200).send({ success: true, data: { accessToken: newAccessToken } })
}))
router.get('/checktoken', requiresAuth(), asyncWrapper(async (req, res) => {
    return res.status(200).send({ success: true})
}))

export default router