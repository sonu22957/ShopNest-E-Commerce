const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
        const pass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

        if (!user || !pass) {
            console.warn("Email configuration missing (EMAIL_USER / EMAIL_PASS). Skipping email dispatch.");
            return;
        }

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user,
                pass,
            },
        });

        const mailOptions = {
            from: user,
            to: options.email || options.to,
            subject: options.subject,
            text: options.message || options.text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${mailOptions.to}`);
    } catch (error) {
        console.error("Nodemailer error (non-fatal):", error.message);
    }
};

module.exports = sendEmail;