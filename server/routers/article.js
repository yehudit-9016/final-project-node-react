const express = require("express")
const router = express.Router()
const articleController = require("../controllers/articleController")

router.get("/",articleController.getAllArticles)
router.get("/:id",articleController.getArticleById)

router.post("/",articleController.createNewArticle)

router.put("/",articleController.updateArticle)

router.delete("/",articleController.deleteArticle)



module.exports = router
