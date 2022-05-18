import { Router } from 'express'
import models from '../../models'
import asyncWrapper from '../../utils/asyncWrapper'
import JWTUtils from '../../utils/jwt-utils'
import requiresAuth from '../../middlewares/requiresAuth'
const { Op } = require("sequelize");

const router = Router()
const { User, RefreshToken } = models;

router.post('/register', asyncWrapper(async (req, res) => {
    const { email, username } = req.body
    const savedUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } })
    if (savedUser) {
        return res.status(200).send({ success: false, message: 'User already exists' })
    }
    const user = await User.createNewUser({ ...req.body, refreshToken: null })
    const payload = { id: user.id, email, username }
    const accessToken = JWTUtils.generateAccessToken(payload)
    const refreshToken = JWTUtils.generateRefreshToken(payload)
    user.RefreshToken.update({ token: refreshToken })
    return res.status(200).send({
        success: true,
        message: 'User successfully register',
        data: {
            accessToken,
            refreshToken,
        }
    })
}
))

router.post('/login', asyncWrapper(async (req, res) => {
    const { username, password } = req.body
    const user = await User.scope('withPassword').findOne({ where: { username } })
    if (!user || !(await user.comparePasswords(password)))
        return res.status(401).send({ success: false, message: 'Invalid credentials' })
    const email = user.email
    const payload = { id: user.id, email, username }
    const accessToken = JWTUtils.generateAccessToken(payload);
    const savedRefreshToken = await user.getRefreshToken();
    let refreshToken;
    if (!savedRefreshToken || !savedRefreshToken.token) {
        refreshToken = JWTUtils.generateRefreshToken(payload);
        if (!savedRefreshToken)
            await user.createRefreshToken({ token: refreshToken });
        else {
            savedRefreshToken.token = refreshToken;
            await savedRefreshToken.save();
        }
    }
    else
        refreshToken = savedRefreshToken.token;
    return res.status(200).send({
        success: true,
        message: 'Successfully logged in',
        data: {
            accessToken,
            refreshToken,
        },
    });

}))

router.post('/logout', requiresAuth(), asyncWrapper(async (req, res) => {
    const { jwt: { email, username } } = req.body;
    console.log('req', req.body)
    const user = await User.findOne({ where: { email, username }, include: RefreshToken });
    user.RefreshToken.token = null;
    await user.RefreshToken.save();
    return res.status(200).send({ success: true, message: 'Successfully logged out' })
}));

export default router