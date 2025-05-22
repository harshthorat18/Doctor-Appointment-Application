const express = require("express");
const { getDoctorInfoControler, updateProfileControler, getAllDoctorControler, getDoctorByIdControler, bookAppointmentController, BookingAvailibilityControler, userappointmentsControler, doctorappointmentsControler, updatestatusControler} = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/getDoctorInfo/:id", authMiddleware, getDoctorInfoControler); // ✅ match the param
router.post('/updateprofile' , authMiddleware , updateProfileControler)
//GET ALL DOC IN HOME PAGE
router.get('/getalldoctors', authMiddleware ,getAllDoctorControler)

//POST GET SINGLE DOC INFO
router.post('/getDoctorById',authMiddleware, getDoctorByIdControler)

//BOOK APPOINTMENTS
router.post('/book-appointment',authMiddleware,bookAppointmentController)

//BOOKING AVLIBILITY
router.post('/booking-availability',authMiddleware,BookingAvailibilityControler)


//APPOINTMENTS LIST OF DOCTOR
router.get('/user-appointments',authMiddleware,userappointmentsControler)


//DOCTOR APPOMINTS
router.get('/doctor-appointments',authMiddleware,doctorappointmentsControler)


//POST Update Status
router.post('/update-status',authMiddleware,updatestatusControler)


module.exports = router;
