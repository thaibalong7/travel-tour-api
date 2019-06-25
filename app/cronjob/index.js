var CronJob = require('cron').CronJob;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

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

async function update_status_booking_finished() {
    try {
        const _book_tour = await db.book_tour_history.findAll({
            where: {
                status: 'paid'
            },
            include: [{
                model: db.tour_turns,
                where: {
                    status: 'public',
                    end_date: {
                        [Op.lte]: new Date() // <= //tức tour đã đi
                    }
                }
            }],
        });

        for (let i = 0, l = _book_tour.length; i < l; i++) {
            _book_tour[i].status = 'finished';
            _book_tour[i].save();
        }

    } catch (error) {
        console.log(error.toString());
    }
}

var cronjob = {
    cron_ckeck_token: function () {
        console.log("Start cron job check token in blacklist ...")
        var job = new CronJob('*/30 * * * *', function () {
            clear_blacklist_token()
        },
            null, true, 'Asia/Ho_Chi_Minh');
    },
    cron_update_status_booking_finished: function () {
        console.log("Start cron job check booking finish ...")
        var job = new CronJob('* */1 * * *', function () { //run in every hour
            update_status_booking_finished();
        },
            null, true, 'Asia/Ho_Chi_Minh');
    }
}


module.exports = cronjob;