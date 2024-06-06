const Users = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const login = async (req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({massage: 'No Parameters'})      
    }
    const foundUser = await Users.findOne({email}).lean()
    if(!foundUser){
        return res.status(401).json({massage: 'Unautherized'})
    }
    const match = await bcrypt.compare(password, foundUser.password)
    if(!match){
        return res.status(401).json({massage: 'Unautherized'})
    }

    const userInfo = {_id:foundUser._id, name:foundUser.name, roles:foundUser.roles,  email:foundUser.email, address:foundUser.address, phone:foundUser.phone, favourites:foundUser.favourites, password:foundUser.password}
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({token:accessToken,user:userInfo})
}


const register = async(req, res)=>{

    const {name,  password, email, address, phone} = req.body
    if(!name  || !password || !email ||!phone){
        return res.status(400).json({massage: 'No Parameters'})
    }

    const duplicate = await Users.findOne({email:email}).lean()
    if(duplicate){
        return res.status(409).json({massage: 'duplicate userName'})
    }

    const hashPwd = await bcrypt.hash(password, 10)
    const userObject = {name, email, address, phone, password: hashPwd, favourites:[]}
    const user = await Users.create(userObject)
    if (user) {
        return res.status(201).json({ message: `New user ${user.email} created` })
    }
    else {
        return res.status(400).json({ message: 'Invalid userHM ' })
    }
}


module.exports = {login, register}