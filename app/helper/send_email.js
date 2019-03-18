var smtpTransport = require('../send_email');
const { html_verify_email, html_forgetPassword_email } = require('../send_email/email_html/email_html');

const sendVerifyEmail = (token, email, req, res) => {
    // verificationMail_data = {
    //     token,
    //     email,
    // }
    var linkVerify, linkTeam;
    if (process.env.NODE_ENV === 'development') {
        linkVerify = "http://" + req.headers.host + "/user/verify?sign=" + token;
        linkTeam = "http://" + req.headers.host;
    }
    else {
        //production
        linkVerify = "https://" + req.headers.host + "/user/verify?sign=" + token;
        linkTeam = "https://" + req.headers.host;
    }
    mailOptions = {
        from: '"Tour Travel" <tour.travel.k15@gmail.com>',
        to: email,
        subject: "Verify account in Tour Travel",
        html: html_verify_email(linkVerify, linkTeam),
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

const sendForgetPasswordEmail = (new_password, _user, req, res) => {
    // verificationMail_data = {
    //     new_password,
    // }
    var linkTeam;
    if (process.env.NODE_ENV === 'development') {
        linkTeam = "http://" + req.headers.host;
    }
    else {
        linkTeam = "https://" + req.headers.host;
    }
    mailOptions = {
        from: '"Tour Travel" <tour.travel.k15@gmail.com>',
        to: _user.email,
        subject: "Reset password in Tour Travel",
        html: html_forgetPassword_email(new_password, linkTeam),
    };
    smtpTransport.sendMail(mailOptions, async function (error, response) {
        if (error) {
            console.log(error);
            res.status(400).json({
                msg: "Error in SMTP server",
                error: error
            });
        } else {
            console.log("Message sent: " + response.messageId + ' Send to: ' + response.accepted);
            await _user.save();
            res.status(200).json({ msg: "Please check your mail to verify!" })
        }
    });
}

module.exports = {
    sendVerifyEmail,
    sendForgetPasswordEmail
}