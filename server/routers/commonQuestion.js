const express = require("express")
const router = express.Router()
const commonQuestionController = require("../controllers/commonQuestionController")

router.get("/",commonQuestionController.getAllQuestions)
router.get("/:id",commonQuestionController.getQuestionById)

router.post("/",commonQuestionController.createNewQuestion)

router.put("/",commonQuestionController.updateQuestion)

router.delete("/",commonQuestionController.deleteQuestion)



module.exports = router
