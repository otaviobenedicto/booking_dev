import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import { createError } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt)

    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })

        await newUser.save()
        res.status(200).json({ message: "Usuario criado com sucesso!" })
    } catch (err) {
        next(err)
    }
}

export const login = async (req, res, next) => {

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt)

    try {
        const user = await User.findOne({ username: req.body.username }).lean()
        if (!user) return next(createError(404, "Usuario não encontrado!"))

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordCorrect) return next(createError(404, "Senha inválida!"))

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT)

        const { password, isAdmin, ...otherDetails } = user
        res.cookie("access_token",token,{
            httpOnly:true
        }).status(200).json({ ...otherDetails })
    } catch (err) {
        next(err)
    }
}
