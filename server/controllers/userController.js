const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const getAllUsers = async (req, res) => {
    const users = await User.find({}, { passward: 0 }).lean()
    if (!users) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
}

const getUserById = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).lean()
    if (!user) {
        return res.status(400).json({ message: 'No user found' })
    }
    res.json(user)
}

const createNewUser = async (req, res) => {

    const { name, password, email, address ,phone, roles} = req.body
    if (!name || !password || !email || !phone) {
        return res.status(400).json({ message: 'No parameters' })
    } 
    if((await User.find({email:email})).length)
    {
        return res.status(400).json({ message: 'email exist' })
    }
    if (roles) {
        if (!["user", "admin"].find(r => r == roles)) {
            return res.status(400).json({ message: 'roles not valid' })
        }
    }
   
    const user = await User.create({ name, password, email, address ,phone, roles, favourites:[] })
    if (user) {
        return res.status(201).json({ message: 'New user created' })
    }
    else {
        return res.status(400).json({ message: 'Invalid user ' })
    }

}

const updateUser = async (req, res) => {
    const { _id, name, email, address ,phone, roles, favourites} = req.body
    if (!_id || !name  || !email || !phone ) {
        return res.status(400).json({ message: 'no parameters' })
    }
    const user = await User.findById(_id).exec()
    if(user.email!=email)
    {
        if((await User.find({email:email})).length)
        {
            return res.status(400).json({ message: 'email exists' })
        }  
    }
    if (roles) {
        if (!["user", "admin"].find(r => r == roles)) {
            return res.status(400).json({ message: 'roles not valid' })
        }
    }

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
   
   

    user.name = name
    user.email = email
    user.address = address
    user.phone = phone

    user.roles = roles
    user.favourites = favourites
    const updatedUser = await user.save()

    const userInfo = {_id:updatedUser._id, name:updatedUser.name, roles:updatedUser.roles, email:updatedUser.email, address:updatedUser.address, phone:updatedUser.phone, favourites:updatedUser.favourites, password:updatedUser.password}
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({token:accessToken})
}

const deleteUser = async (req, res) => {
    const { id } = req.body
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
    const result = await user.deleteOne()
    res.json(result)
}

const updateFavourites = async(req, res)=>{
    const { _id , id } = req.body
    if(!_id || !id ){
        return res.status(400).json({ message: 'no parameters' })
    }
    const user = await User.findById(_id).exec()
    if(!user){
        return res.status(400).json({ message: 'User not found' })
    }
  const result = user.favourites.find(f=> f==id)
  if(result)
   {
        return res.status(400).json({ message: `${id} exists in your favourites` })
   }
    user.favourites = [...user.favourites, id]
    const updatedUser = await user.save()
    const userInfo = {_id:updatedUser._id, name:updatedUser.name, roles:updatedUser.roles, email:updatedUser.email, address:updatedUser.address, phone:updatedUser.phone, favourites:updatedUser.favourites, password:updatedUser.password}
   const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
   res.json({token: accessToken ,favourites:userInfo.favourites})
  
}
const deleteFavourites = async(req, res)=>{
    
    const { _id , id } = req.body
    if(!_id || !id ){
        return res.status(400).json({ message: 'no parameters' })
    }

    const user = await User.findById(_id).exec()
    if(!user){
        return res.status(400).json({ message: 'User not found' })
    }
     
   const new_favourites = user.favourites.filter(f=> f!=id)
   user.favourites = new_favourites
   const updatedUser = await user.save()
   const userInfo = {_id:updatedUser._id, name:updatedUser.name, roles:updatedUser.roles, email:updatedUser.email, address:updatedUser.address, phone:updatedUser.phone, favourites:updatedUser.favourites, password:updatedUser.password}
   const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
   res.json({token: accessToken ,user:userInfo})
}


module.exports = { getAllUsers, createNewUser, updateUser, deleteUser, getUserById, updateFavourites, deleteFavourites}