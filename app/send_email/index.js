var smtpConfig = require('../config/setting').smtpConfig;
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport(smtpConfig);

module.exports = smtpTransport;