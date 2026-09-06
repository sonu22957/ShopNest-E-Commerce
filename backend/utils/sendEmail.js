const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: options.email || options.to,
            subject: options.subject,
            text: options.message || options.text,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendEmail;