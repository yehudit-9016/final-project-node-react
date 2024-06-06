const Massage = require("../models/Massage")

const getAllMassages = async (req, res) => {
    let massages ={}
    if( req.user.roles=="user"){
        massages = await Massage.find({user: req.user._id}).lean()}
    else{
        massages = await Massage.find().lean()
    }
    if (!massages) {
        return res.status(400).json({ message: 'No massages found' })
    }
    res.json(massages)
}

const getMassageById = async (req, res) => {
    const { id } = req.params
    const massage = await Massage.findById(id).lean()
    if (!massage) {
        return res.status(400).json({ message: 'No product found' })
    }
    res.json(massage)
}

const createNewMassage = async (req, res) => {
    
    const {title, question } = req.body
    if (!title || !question ) {
        return res.status(400).json({ message: 'No parameters' })
    } 
    
   
    const massage  = await Massage.create({ user: req.user._id, title, question, history:[], massageStatus:0 })
    if (massage) {
        return res.status(201).json({ message: 'New massage created' })
    }
    else {
        return res.status(400).json({ message: 'Invalid massage ' })
    }

}

const updateMassage = async (req, res) => {
    const { _id, question, answer, status} = req.body
    if (!_id ||!question && !answer) {
        return res.status(400).json({ message: 'no parameters' })
    }
    const massage = await Massage.findById(_id).exec()
    if (!massage) {
        return res.status(400).json({ message: 'massage not found' })
    }
    
    if(req.user.roles == 'user'){
        if(massage.question!="" || answer){
            return res.status(400).json({ message: 'you have not a permission' })
        }
        massage.question = question
        massage.massageStatus = 0
    }
    else{
        if(massage.question == "" || question){
           return res.status(400).json({ message: 'you have not a permission' })
        }
        massage.answer = answer
        massage.massageStatus = 1
    }
    
    if(massage.answer!="")
       { 
        
        massage.history = [...massage.history, {questionh : massage.question, answerh: answer, date: Date.now()}]
        massage.question = ""
        massage.answer = ""
      }
    

    const updatedMassage = await massage.save()
    res.json(`'${updatedMassage.title}' updated`)
}

const deleteMassage = async (req, res) => {
    const { id } = req.body
    const massage = await Massage.findById(id).exec()
    if (!massage) {
        return res.status(400).json({ message: 'massage not found' })
    }
    const result = await massage.deleteOne()
    res.json(result)
}

module.exports = { getAllMassages, getMassageById, createNewMassage, updateMassage, deleteMassage }