const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        price:{
            type:String,
            require: true
        },
        imageURL:{
            type:[String]
        },
        video:{
            type: String
        },
        category:{
            type: String,
            enum:["צמיד", "שרשרת", "עגילים", "טבעת"]
        }
   
    }, {
    timestamps: true
})

module.exports = mongoose.model('Product', productSchema)