const mongoose = require("mongoose")

const massageSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        title: {
            type: String
        },
        history:{
            type:[
                {
                    questionh: String,
                    answerh: String,
                    date: Date
                }
            ]
        },
        question:{
            type:String
        },
        answer:{
            type:String
        },
        massageStatus:{
            type: Number
        }
    }, {
    timestamps: true
})

module.exports = mongoose.model('Massage', massageSchema)