const Article = require("../models/Article")

const getAllArticles = async (req, res) => {
    const articles = await Article.find().lean()
    if (!articles) {
        return res.status(400).json({ message: 'No articles found' })
    }
    res.json(articles)
}

const getArticleById = async (req, res) => {
    const { id } = req.params
    const articles = await Article.findById(id).lean()
    if (!articles) {
        return res.status(400).json({ message: 'No articles found' })
    }
    res.json(articles)
}

const createNewArticle = async (req, res) => {

    const { title, fileURL, isActive } = req.body
    if (!fileURL) {
        return res.status(400).json({ message: 'No parameters' })
    } 
   
    const article  = await Article.create({ title, fileURL, isActive })
    if (article) {
        return res.status(201).json({ message: 'New article created' })
    }
    else {
        return res.status(400).json({ message: 'Invalid article' })
    }

}

const updateArticle = async (req, res) => {
    const { _id, title, fileURL, isActive } = req.body
    if (!_id || !fileURL ) {
        return res.status(400).json({ message: 'no parameters' })
    }
    const article = await Article.findById(_id).exec()

    if (!article) {
        return res.status(400).json({ message: 'article not found' })
    }
    article.title = title
    article.fileURL = fileURL
    article.isActive = isActive
    
    const updatedArticle = await article.save()
    res.json(`'${updatedArticle.title}' updated`)
}

const deleteArticle = async (req, res) => {
    const { id } = req.body
    const article = await Article.findById(id).exec()
    if (!article) {
        return res.status(400).json({ message: 'article not found' })
    }
    const result = await Article.deleteOne()
    res.json(result)
}

module.exports = { getAllArticles, getArticleById, createNewArticle, updateArticle, deleteArticle }