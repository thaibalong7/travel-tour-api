var CronJob = require('cron').CronJob;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../models');

var publicKEY = fs.readFileSync('./app/middleware/public.key', 'utf8');
var verifyOptions = {
    expiresIn: '1d',
    algorithm: "RS256"
}

async function clear_blacklist_token() {
    db.blacklist_tokens.findAll().then(_blacktokens => {
        _blacktokens.forEach(blacktoken => {
            try {
                jwt.verify(blacktoken.token, publicKEY, verifyOptions)
            }
            catch (err) {
                console.log('delete token: ' + blacktoken.token)
                blacktoken.destroy();
            }
        });
    })
}

var cronjob = {
    cron_ckeck_token: function () {
        console.log("Start cron job check token in blacklist ...")
        var job = new CronJob('*/30 * * * *', function () {
            clear_blacklist_token()
        },
            null, true, 'Asia/Ho_Chi_Minh');

    }
}


module.exports = cronjob;