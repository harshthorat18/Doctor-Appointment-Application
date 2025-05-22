const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require('../models/doctorModel');

// REGISTER CONTROLLER
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).send({
        message: "User Already Exists",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    await newUser.save();

    res.status(201).send({
      message: "Registration Successful",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Register Controller Error: ${error.message}`,
      success: false,
    });
  }
};

// LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Generating token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Respond with user data including isAdmin
    res.status(200).send({
      message: "Login Successful",
      success: true,
      token,
      user: {  // Adding user data to the response
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,  // Add the isAdmin status
        isDoctor: user.isDoctor,  // Add the isDoctor status
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Login Controller Error: ${error.message}`,
      success: false,
    });
  }
};


// AUTH MIDDLEWARE
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status().send({
        message: "Authorization failed",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send({
        message: "Token expired or invalid",
        success: false,
      });
    }
    req.body.userId = decoded.id;
  
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      message: "Auth Middleware Error",
      success: false,
    });
  }
};




// GET USER DATA CONTROLLER
const getUserDataController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined; // hide password

    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    res.status(200).send({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isDoctor: user.isDoctor,
        _id: user._id,
        notifications: user.notifications
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Auth error",
      success: false,
      error,
    });
  }
};



//  apply doc controle


const applyDoctorController = async (req, res) => {
  try {
    console.log("🔥 APPLY DOCTOR CONTROLLER CALLED");
    console.log("📦 Request Body:", req.body);
    console.log("👤 User ID from Middleware:", req.body.userId);

    // Create the new doctor document
    const newDoctor = new doctorModel({
      ...req.body,
      status: 'pending',
    });

    await newDoctor.save(); // ⛔️ Likely error here — maybe required fields are missing

    // Find the admin user
    const adminUser = await userModel.findOne({ isAdmin: true });
    if (!adminUser) {
      console.log("❌ Admin not found!");
      return res.status(404).send({
        success: false,
        message: 'Admin user not found to notify',
      });
    }

    console.log("👑 Admin Found:", adminUser?.email);
if (!adminUser.notifications) {
  adminUser.notifications = [];
}

    // Push notification to the admin
   adminUser.notifications.push({
  type: 'apply-doctor-request',
  message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
  data: {
    doctorId: newDoctor._id,
    name: `${newDoctor.firstName} ${newDoctor.lastName}`,
    onClickPath: '/admin/doctors',
  },
});


    // Save the admin user with the new notification
    await adminUser.save();

    res.status(201).send({
      success: true,
      message: 'Doctor account applied successfully',
    });
  } catch (error) {
    console.error("❌ ERROR in applyDoctorController:", error.message);
    res.status(500).send({
      success: false,
      message: 'Error while applying for doctor',
      error: error.message,
    });
  }
};

//getAllnotification ctrl
const getAllNotificationControler = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    // Move all unread notifications to seen
    user.seennotification.push(...user.notifications);  // ✅ Corrected to push unread notifications to seen
    user.notifications = []; // Clear the unread notifications// Clear the unread notifications
    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: 'All notifications marked as read',
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error in notification',
      success: false,
      error,
    });
  }
};

//delete notification
const deleteAllNotificationControler = async(req,res)=> {
try{
  const user = await userModel.findOne({_id:req.body.userId})
  user.notifications=[]
  user.seennotification = []
  const updatedUser = await user.save()
  updatedUser.password=undefined
  res.status(200).send({
    success: true,
    message: 'All notifications Deleted succrssfully',
    data:updatedUser
  })
}catch(error){
  console.log(error)
  res.status(500).send({
    success:false,
    message:"unable to delete",
    error
  })
}
}




module.exports = {
  registerController,
  loginController,
  getUserDataController,
  applyDoctorController, // ✅ THIS MUST BE INCLUDED
  authMiddleware,
  getAllNotificationControler,
  deleteAllNotificationControler
};





