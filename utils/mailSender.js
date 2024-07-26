const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async function (email, title, body) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "Indore Municipal Corporation",
      to: email,
      subject: title,
      html: body,
    });

    return info;
  } catch (error) {
    //TODO: handle error here
    console.error(error.message);
  }
};

module.exports = mailSender;
