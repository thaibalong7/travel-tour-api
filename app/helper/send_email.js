var smtpTransport = require('../send_email');
const { html_verify_email, html_forgetPassword_email } = require('../send_email/email_html/email_html');

const sendVerifyEmail = (verificationMail, req, res) => {
    // verificationMail_data = {
    //     token,
    //     email,
    // }
    verificationMail.linkVerify = "http://" + req.headers.host + "/user/verify?sign=" + verificationMail.token;
    verificationMail.linkTeam = "http://" + req.headers.host;
    mailOptions = {
        from: '"Tour Travel" <tour.travel.k15@gmail.com>',
        to: verificationMail.email,
        subject: "Verify account in Tour Travel",
        html: html_verify_email(verificationMail),
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.status(400).json({
                msg: "Error in SMTP server",
                error: error
            });
        } else {
            console.log("Message sent: " + response.messageId + ' Send to: ' + response.accepted);
            res.status(200).json({ msg: "Please check your mail to verify!" })
        }
    });
}

const sendForgetPasswordEmail = (forgetPasswordEmail, req, res) => {
    // verificationMail_data = {
    //     new_password,
    // }
    forgetPasswordEmail.linkTeam = "http://" + req.headers.host;
    mailOptions = {
        from: '"Tour Travel" <tour.travel.k15@gmail.com>',
        to: forgetPasswordEmail.email,
        subject: "Reset password in Tour Travel",
        html: html_forgetPassword_email(forgetPasswordEmail),
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.status(400).json({
                msg: "Error in SMTP server",
                error: error
            });
        } else {
            console.log("Message sent: " + response.messageId + ' Send to: ' + response.accepted);
            res.status(200).json({ msg: "Please check your mail to verify!" })
        }
    });
}

module.exports = {
    sendVerifyEmail,
    sendForgetPasswordEmail
}