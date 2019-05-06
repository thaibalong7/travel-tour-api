var smtpTransport = require('../send_email');
const { html_verify_email, html_forgetPassword_email, html_e_ticket } = require('../send_email/email_html/email_html');

const sendVerifyEmail = (token, email, req, res) => {
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
        subject: "[Tour Travel] Chứng thực tài khoản",
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
        subject: "[Tour Travel] Thay đổi mật khẩu",
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

const sendETicketEmail = (req, res, book_tour) => {
    var linkTeam;
    if (process.env.NODE_ENV === 'development') {
        linkTeam = "http://" + req.headers.host;
    }
    else {
        linkTeam = "https://" + req.headers.host;
    }
    mailOptions = {
        from: '"Tour Travel" <tour.travel.k15@gmail.com>',
        to: book_tour.book_tour_contact_info.email,
        subject: "[Tour Travel] Vé Điện Tử " + book_tour.code,
        html: html_e_ticket(linkTeam, book_tour),
    };
    smtpTransport.sendMail(mailOptions, async function (error, response) {
        if (error) {
            console.log(error);
            // res.status(400).json({
            //     msg: "Error in SMTP server",
            //     error: error
            // });
        } else {
            console.log("Message sent: " + response.messageId + ' Send to: ' + response.accepted);
        }
    });

}

module.exports = {
    sendVerifyEmail,
    sendForgetPasswordEmail,
    sendETicketEmail
}