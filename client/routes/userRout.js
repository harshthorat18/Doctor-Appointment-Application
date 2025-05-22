
const express = require("express");
const {
  registerController,
  loginController,
  getUserDataController,
  authMiddleware,
  applyDoctorController,
  getAllNotificationControler,
  deleteAllNotificationControler
} = require("../controllers/userCtrl");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/getUserData", authMiddleware, getUserDataController);

//APPLY DOCTOR !! POST
router.post('/apply-doctor', authMiddleware, applyDoctorController);

//Notifibvation !! POST
router.post("/get-all-notification" ,authMiddleware,getAllNotificationControler)
router.post("/delete-all-notification" ,authMiddleware,deleteAllNotificationControler)


module.exports = router;
