const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            require: true
        },
        password:{
            type: String,
            require: true
        },
        
        email: {
            type: String,
            lowercase:true,
            require: true,
            unique:true,
        },
        address: {
            type: String,
        },
        
        phone:{
            type:String,
            require: true
        },
        roles:{
         type:String,
         enum:["user","admin"],
         default:"user",
        //  require: true
        },
        favourites:{
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Product"
        }
   
    }, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)