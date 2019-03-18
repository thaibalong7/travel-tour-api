var smtpConfig = require('../config/config').smtpConfig;
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport(smtpConfig);

module.exports = smtpTransport;