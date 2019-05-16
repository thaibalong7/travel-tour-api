var smtpTransport = require('../send_email');
const { html_verify_email,
    html_forgetPassword_email,
    html_e_ticket_email,
    html_confirm_cancel_email,
    html_refunded_email,
    html_confirm_cancel_with_no_money_email } = require('../send_email/email_html/email_html');
const company_info = require('../config/setting').company_info

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
        from: '"' + company_info.name + '" <tour.travel.k15@gmail.com>',
        to: email,
        subject: "[" + company_info.name + "] Chứng thực tài khoản",
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
        from: '"' + company_info.name + '" <tour.travel.k15@gmail.com>',
        to: _user.email,
        subject: "[" + company_info.name + "] Thay đổi mật khẩu",
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
        from: '"' + company_info.name + '" <tour.travel.k15@gmail.com>',
        to: book_tour.book_tour_contact_info.email,
        subject: "[" + company_info.name + "] Vé Điện Tử #" + book_tour.code,
        html: html_e_ticket_email(linkTeam, book_tour),
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

const sendConfirmCancelEmail = (req, cancel_booking) => {
    var linkTeam;
    if (process.env.NODE_ENV === 'development') {
        linkTeam = "http://" + req.headers.host;
    }
    else {
        linkTeam = "https://" + req.headers.host;
    }
    mailOptions = {
        from: '"' + company_info.name + '" <tour.travel.k15@gmail.com>',
        to: cancel_booking.book_tour_history.book_tour_contact_info.email,
        subject: "[" + company_info.name + "] Xác nhận hủy vé #" + cancel_booking.book_tour_history.code,
        html: html_confirm_cancel_email(linkTeam, cancel_booking),
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

const sendRefundedEmail = (req, cancel_booking) => {
    var linkTeam;
    if (process.env.NODE_ENV === 'development') {
        linkTeam = "http://" + req.headers.host;
    }
    else {
        linkTeam = "https://" + req.headers.host;
    }
    mailOptions = {
        from: '"' + company_info.name + '" <tour.travel.k15@gmail.com>',
        to: cancel_booking.book_tour_history.book_tour_contact_info.email,
        subject: "[" + company_info.name + "] Thông báo hoàn tiền #" + cancel_booking.book_tour_history.code,
        html: html_refunded_email(linkTeam, cancel_booking),
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

const sendConfirmCancelWithNoMoneyEmail = (req, cancel_booking) => {
    var linkTeam;
    if (process.env.NODE_ENV === 'development') {
        linkTeam = "http://" + req.headers.host;
    }
    else {
        linkTeam = "https://" + req.headers.host;
    }
    mailOptions = {
        from: '"' + company_info.name + '" <tour.travel.k15@gmail.com>',
        to: cancel_booking.book_tour_history.book_tour_contact_info.email,
        subject: "[" + company_info.name + "] Thông báo hủy vé #" + cancel_booking.book_tour_history.code,
        html: html_confirm_cancel_with_no_money_email(linkTeam, cancel_booking),
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
    sendETicketEmail,
    sendConfirmCancelEmail,
    sendRefundedEmail,
    sendConfirmCancelWithNoMoneyEmail
}