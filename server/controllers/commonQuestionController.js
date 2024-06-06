const Question = require("../models/CommonQuestion")

const getAllQuestions = async (req, res) => {
    const question = await Question.find().lean()
    if (!question) {
        return res.status(400).json({ message: 'No question found' })
    }
    res.json(question)
}

const getQuestionById = async (req, res) => {
    const { id } = req.params
    const question = await Question.findById(id).lean()
    if (!question) {
        return res.status(400).json({ message: 'No question found' })
    }
    res.json(question)
}

const createNewQuestion = async (req, res) => {

    const { question, answer, isActive } = req.body
    if (!question || !answer) {
        return res.status(400).json({ message: 'No parameters' })
    } 
   
    const commonquestion  = await Question.create({ question, answer, isActive })
    if (commonquestion) {
        return res.status(201).json({ message: 'New question created' })
    }
    else {
        return res.status(400).json({ message: 'Invalid question' })
    }

}

const updateQuestion = async (req, res) => {
    const { _id, question, answer, isActive } = req.body
    if (!_id || !question || !answer) {
        return res.status(400).json({ message: 'no parameters' })
    }
    const commonquestion = await Question.findById(_id).exec()

    if (!commonquestion) {
        return res.status(400).json({ message: 'question not found' })
    }
    commonquestion.question = question
    commonquestion.answer = answer
    commonquestion.isActive = isActive
    
    const updatedQuestion = await commonquestion.save()
    res.json(`'${updatedQuestion.question}' updated`)
}

const deleteQuestion = async (req, res) => {
    const { id } = req.body
    const commonquestion = await Question.findById(id).exec()
    if (!commonquestion) {
        return res.status(400).json({ message: 'qustion not found' })
    }
    const result = await Question.deleteOne()
    res.json(result)
}

module.exports = { getAllQuestions, getQuestionById, createNewQuestion, updateQuestion, deleteQuestion }