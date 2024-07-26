const express = require('express');
//const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
//const app = express();
const router = express.Router();
const { User, OTP } = require('./models');  
const otpGenerator = require('otp-generator');


router.get('/', (req, res) => {
    res.render('userlogin');  // userlogin.ejs
});

router.post('/register', async (req, res) => {
    const { username, employeeID, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);


  await User.create({ username, employeeID, email, password: hashedPassword });

  res.status(201).json({ message: "User registered successfully" });
  //res.redirect('/index');  // Redirect to home page or another page after processing
});

//send otp
router.post('/send-otp', async (req, res) => {
  //fetch email from req body
  const { email } = req.body;
  //check if user already exists ?
  if (!email)
  {
    return res.status(500).json({
      success: false,
      msg: "user does not exists",
    });
  }
  const checkUserPresent = await User.findOne({ email });

  if (!checkUserPresent) 
  {
    return res.status(200).json({
      success: false,
      msg: "otp is not present",
    });
  }
  //generate Otp
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  //TODO: check if otp is unique

  //save otp in db
  const otpBody = await OTP.create({ email, otp });
  console.log("Otp sent successfully");
  return res.status(200).json({
    success: true,
    msg: "otp sent successfully",
    otp,
  });
});

module.exports = router;