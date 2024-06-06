require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/dbConn")
const corsOptions = require("./config/corsOptions")
const mongoose = require("mongoose")
const app = express()
const PORT = process.env.PORT || 1234
connectDB()
app.use(express.json())
app.use(cors(corsOptions))
app.use(express.static("public"))
app.use(express.static("public"))

app.get('/uploads/:filename', (req, res) => {
    const imagePath = path.join(__dirname, '/public/upload/', req.params.filename);
    res.sendFile(imagePath, { headers: { 'Content-Type': 'image/jpeg' } });
});
app.use('/uploads', express.static(__dirname + '/public/upload'));

app.get("/", (req, res) => {
    res.send("this is home page")
})
app.use("/api/user", require("./routers/user"))
app.use("/api/product", require("./routers/product"))
app.use("/api/massage", require("./routers/massage"))
app.use("/api/commonQuestion", require("./routers/commonQuestion"))
app.use("/api/article", require("./routers/article"))
app.use("/api/auth", require("./routers/auth"))

mongoose.connection.once('open', () => {
    console.log('connected to mongodb')
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
})

mongoose.connection.on('error', err => { console.log(err) })
