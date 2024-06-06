const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        fileURL:{
            type:String,
            require: true
        },
        isActive:{
            type:Boolean,
            default: true
        }
    }, {
    timestamps: true
})

module.exports = mongoose.model('Article', articleSchema)