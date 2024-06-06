const express = require("express")
const router = express.Router()
const massageController = require("../controllers/massageController")
const verifyJWT = require("../middleWare/verifyJWT")

router.get("/", verifyJWT, massageController.getAllMassages)
router.get("/:id",massageController.getMassageById)

router.post("/",verifyJWT, massageController.createNewMassage)

router.put("/",verifyJWT,massageController.updateMassage)

router.delete("/",massageController.deleteMassage)



module.exports = router