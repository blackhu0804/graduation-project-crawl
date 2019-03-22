const { Service } = require("egg");
const nodemailer = require("nodemailer");
const config = {
  host: "smtp.qq.com",
  port: 587,
  auth: {
    user: "812510003@qq.com",
    pass: "fcapplykvfabbccg"
  }
};
const transporter = nodemailer.createTransport(config);

class SendCode extends Service {
  async send(mailOptions) {
    let result = await transporter.sendMail(mailOptions);
    // console.log(result);
    return result;
  }
}

module.exports = SendCode;
