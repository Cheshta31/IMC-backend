require('dotenv').config();
const mongoose = require('mongoose');
const mailSender = require("../utils/mailSender");

//connection to mongodb
mongoose.connect(process.env.MONGODB_URI || 
    "mongodb+srv://nandinijoshi2016:exo-L%40ot9@cluster0.vyrr1j7.mongodb.net/employee_complaint?retryWrites=true&w=majority&appName=Cluster0", {
}).then(() => {
    console.log('Connected to MongoDB');   
}).catch((e) => {
    console.log("Connection failed", e);
}) 

//user model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    employeeID: { type: String, required: true, unique : true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

//otp model
const OTPSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
  });

  OTPSchema.pre("save", async function (next) {
    try {
      //only send email when a new Document is created
      if (this.isNew) {
        const mailResponse = await mailSender(
          this.email,
          "Verification Email",
          this.otp,
        );
        console.log("Verification Mail Sent :" + mailResponse.response);
      }
      next();
    } catch (error) {
      console.error("Error occurred while sending email", error);
    }
  });
  
  
  const User = mongoose.model('User', userSchema);
  const OTP = mongoose.model('OTP', OTPSchema);
  
  module.exports = { User, OTP };