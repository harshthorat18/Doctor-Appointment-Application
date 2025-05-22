const appointmentModel = require('../models/appoinmentModel');
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModels');
const moment = require('moment')

const getDoctorInfoControler = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.params.id }); // ✅ use req.params.id
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in Fetching Doctor Details',
    });
  }
};

const updateProfileControler = async(req,res) =>{
    try{
        const doctor=await doctorModel.findOneAndUpdate({userId:req.body.userId}, req.body)
        res.status(201).send({
            success:true,
            message: "Doctor Profile Updated",
            data:doctor
        })
    }catch(error){
        console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in Doctor Profile Update',
    });
    }
}

const getAllDoctorControler = async(req,res)=>{
     try{
        const doctors=await doctorModel.find({status:'approvoed'})
        res.status(201).send({
            success:true,
            message: "Doctors List Fetched Successfully",
            data:doctors
        })
    }catch(error){
        console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in Getting Doctor',
    });
    }
}

//GET SINGLE DOCTOR
const getDoctorByIdControler=async(req,res)=>{
    try{
        const doctor=await doctorModel.findOne({_id:req.body.doctorId})
        res.status(201).send({
            success:true,
            message: "Doctor Fetched Successfully",
            data:doctor
        })
    }catch(error){
        console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in Getting Single Doctor',
    });
    }
}



const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date , 'DD-MM-YYYY').toISOString()
    req.body.time = moment(req.body.time, 'HH:mm').toISOString()
    req.body.status = 'pending';

    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notifications.push({
      type: 'New-appointment-request',
      message: `A New Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: '/doctors/appointments',
    });
    await user.save();

    res.status(201).send({
      success: true,
      message: "Appointment Booked Successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error While Booking Appointment',
    });
  }
};


const BookingAvailibilityControler = async (req, res) => {
  try {
    const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();

    const [from, to] = req.body.time; // expects time to be [fromTime, toTime]
    const fromTime = moment(from, 'HH:mm').toISOString();
    const toTime = moment(to, 'HH:mm').toISOString();

    const doctorId = req.body.doctorId;

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        success: true,
        message: 'Appointments not Available at this time',
      });
    } else {
      return res.status(200).send({
        success: true,
        message: 'Appointments Available',
      });
    }
  } catch (error) {
    console.log('Booking Availability Error:', error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error While Booking Appointment',
    });
  }
};


const userappointmentsControler = async (req, res) => {
  try {
    // Use req.query.userId if sent as query param from frontend
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User ID is required",
      });
    }

    const appointments = await appointmentModel.find({ userId });

    res.status(200).send({
      success: true,
      message: "User Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log("Booking Availability Error:", error);
    res.status(500).send({
      success: false,
      error: error.message || error,
      message: "Error In User Appointment",
    });
  }
};



const doctorappointmentsControler = async (req, res) => {
  try {
    const userId = req.query.userId;  // ✅ Get from query params

    const doctor = await doctorModel.findOne({ userId });
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointments = await appointmentModel.find({ doctorId: doctor._id }).populate("userId");

    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log("Booking Availability Error:", error);
    res.status(500).send({
      success: false,
      error: error.message || error,
      message: "Error In Doc Appointment",
    });
  }
};


const updatestatusControler = async(req,res) =>{
    try{
        const {appointmentsId,status} = req.body
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId,{status})
        const user = await userModel.findOne({ _id: appointments.userId });

    const notifications = user.notifications;
    notifications.push({
      type: 'status updated',
      message: `Your Appointment Request has been updated ${status}`,
      onClickPath: '/doctor-appointments',
    });

    await user.save();
    res.status(200).send({
        success: true,
        message: "Appointment Status Updated Successfully"
    })
    }catch (error) {
    console.log("Booking Availability Error:", error);
    res.status(500).send({
      success: false,
      error: error.message || error,
      message: "Error In Update Status",
    });
  }
}



module.exports = { 
    getDoctorInfoControler,
    updateProfileControler,
    getAllDoctorControler,
    getDoctorByIdControler,
    bookAppointmentController,
    BookingAvailibilityControler,
    userappointmentsControler,
    doctorappointmentsControler,
    updatestatusControler};
