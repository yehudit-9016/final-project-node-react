const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.get("/",userController.getAllUsers)
router.get("/:id",userController.getUserById)

router.post("/",userController.createNewUser)

router.put("/",userController.updateUser)
router.put("/favourite", userController.updateFavourites)

router.delete("/",userController.deleteUser)

router.delete("/favourite", userController.deleteFavourites)


module.exports = router