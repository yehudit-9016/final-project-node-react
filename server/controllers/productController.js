const Product = require("../models/Product")

const getAllProducts = async (req, res) => {
    const { category } = req.query
    let products
    if (category) {
        products = await Product.find({ category: category }).lean()
    }
    else {
        products = await Product.find().lean()
    }
    if (!products) {
        return res.status(400).json({ message: 'No products found' })
    }
    res.json(products)
}

const getProductById = async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id).lean()
    if (!product) {
        return res.status(400).json({ message: 'No product found' })
    }
    res.json(product)
}

const createNewProduct = async (req, res) => {
    const {name, description, price, video, category } = req.body
    if (!name || !description || !price  || !category) {
        return res.status(400).json({ message: 'No parameters' })
    }
    
    if ((await Product.find({ name: name })).length) {
        return res.status(400).json({ message: 'product exist' })
    }
    let imageURL=[]
    req.files.forEach(element => {
        imageURL.push(element.path)
    });

    const product = await Product.create({ name, description, price, imageURL, video, category })
    if (product) {
        return res.status(201).json({ message: 'New product created' })
    }
    else {
        return res.status(400).json({ message: 'Invalid product ' })
    }

}



const updateProduct = async (req, res) => {
    const { _id, name, description, price, video,category } = req.body
    if (!_id || !name || !description || !price  || !category) {
        return res.status(400).json({ message: 'No parameters' })
    }
    const product = await Product.findById(_id).exec()
    if (!product) {
        return res.status(400).json({ message: 'product not found' })
    }

    let imageURL=[]
    if(req.files)
    {
        req.files.forEach(element => {
            imageURL.push(element.path)
        });
    }
   
    if (product.name != name) {
        if ((await Product.find({ name: name })).length) {
            return res.status(400).json({ message: 'This name is already exist' })
        }
    }
    product.category = category
    product.name = name
    product.description = description
    product.price = price
    product.imageURL = imageURL.length>0?imageURL:product.imageURL
    product.video = video
    const updateProduct = await product.save()
    res.json(`${updateProduct.name} updated`)
}



const deleteProduct = async (req, res) => {
    const { id } = req.body
    const product = await Product.findById(id).exec()
    if (!product) {
        return res.status(400).json({ message: 'product not found' })
    }
    const result = await product.deleteOne()
    res.json(result)
}

module.exports = { getAllProducts, getProductById, createNewProduct, updateProduct, deleteProduct }