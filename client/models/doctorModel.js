const mongoose=require ('mongoose')
const doctorSchema = new mongoose.Schema({
    userId:{
        type:String,
        
    },
    firstName:{
        type:String,
        required:[true,'first name is required']
    },
    lastName:{
        type:String,
        required:[true,'last name is required']
    },
    phone:{
        type:String,
        required:[true,'phone number is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    website:{
        type:String,
    },
    address:{
        type:String,
        required:[true,'Address is required']
    },
    specialization:{
        type:String,
        required:[true,'specialization is required']
    },
    experience:{
        type:Number,
        required:[true,'experience is required']
    },
    feesPerConsultation:{
        type:Number,
        required:[true,'feesPerCunsaltaion is required']
    },
    status:{
        type: String,
        default: 'pending'
    },
    timings:{
        type:Array,
        required:[true,'Work Timing is required']
    },
    

},
{timestamps: true}
)

const doctorModel = mongoose.model('doctors',doctorSchema)

module.exports=doctorModel;







// {
//     "userId":"1112",
//         "firstName":"ABC",
//         "lastName":"XYZ",
//         "phone":"123456",
//         "email":"ABC@gmail",
//         "website":"www.abc.com",
//         "address":"Pune",
//         "specialization":"AAAA",
//         "experience":6,
//         "feesPerCunsaltaion":9000,
//         "status":"XXX",
//         "timings":5
//     }