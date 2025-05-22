const doctorModel = require ('../models/doctorModel')
const userModel = require('../models/userModels')


const getAllUserControler = async (req, res) => {
    try {
      const users = await userModel.find({});
      res.status(200).send({
        success: true,
        message: 'Users data list',
        data: users
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error while fetching users',
        error
      });
    }
  };
  

  const getAllDoctorsControler = async (req, res) => {
    try {
      const doctors = await doctorModel.find({});
      res.status(200).send({
        success: true,
        message: 'Doctor data list',
        data: doctors
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error while fetching doctors',
        error
      });
    }
  };
  
// DOCTOR ACCOUNT STATUS CONTROLLER
  const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    const user = await userModel.findOne({ _id: doctor.userId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }
console.log('Updated notifications:', user.notifications);
    // Ensure notification array exists
    if (!user.notifications) {
      user.notifications = [];
    }

    user.notifications.push({
      type: 'doctor-account-request-updated',
      message: `Your Doctor Account Request Has ${status}`,
      onClickPath: '/notification'
    });

    user.isDoctor = status === 'approvoed' ? true : false;
    console.log('User before save:', user);
    await user.save();

    res.status(201).send({
      success: true,
      message: 'Doctor Account Status Updated',
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in Account Status',
      error: error.message
    });
  }
};


  module.exports = {
    getAllUserControler,
    getAllDoctorsControler,
    changeAccountStatusController
  };
  