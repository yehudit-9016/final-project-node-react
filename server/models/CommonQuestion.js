const mongoose = require("mongoose")

const commonQuestionSchema = new mongoose.Schema(
    {
        
        question: {
            type: String,
            require: true
        },
        answer:{
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

module.exports = mongoose.model('CommonQuestion', commonQuestionSchema)