const express = require ('express')
const authMiddleware = require("../middlewares/authMiddleware");
const { 
    getAllUserControler,
    getAllDoctorsControler, 
    changeAccountStatusController
} = require('../controllers/adminCtrl');


const router= express.Router()

//GET METHOD !! USER
router.get('/getAllUsers',authMiddleware,getAllUserControler)

//GET METHOD !! DOCTOR
router.get('/getAllDoctor',authMiddleware,getAllDoctorsControler)

//POST ACCOUNT STATUS
router.post('/changeAccountStatus',authMiddleware,changeAccountStatusController)

module.exports = router;