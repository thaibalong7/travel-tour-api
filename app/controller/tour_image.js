const db = require('../models');
const tour_images = db.tour_images;
const helper_add_link = require('../helper/add_full_link');
const fs = require('fs');
const link_img = require('../config/setting').link_img;

const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

const asyncFor = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        await cb(arr[i], i);
    }
}

exports.getByTour = async (req, res) => {
    try {
        const idTour = req.params.id;
        if (!isNaN(idTour)) {
            const check_tour = await db.tours.findByPk(idTour);
            if (check_tour) {
                const query = {
                    where: {
                        fk_tour: idTour
                    },
                    attributes: { exclude: ['fk_tour'] }
                }
                tour_images.findAll(query).then(async _tour_images => {
                    // console.log(_tour_images)
                    const result = await helper_add_link.addLinkTourImgOfListToursImg(_tour_images, req.headers.host)
                    return res.status(200).json({ data: result });
                }).catch(err => {
                    return res.status(400).json({ msg: err });
                })
            }
            else {
                return res.status(400).json({ msg: 'Wrong id tour' });
            }
        }
        else {
            return res.status(400).json({ msg: 'Wrong id tour' });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err });
    }
}

exports.createByTour = async (req, res) => {
    try {
        const idTour = req.body.idTour
        if (!isNaN(idTour)) {
            const check_tour = await db.tours.findByPk(idTour);
            if (check_tour) {
                if (typeof req.files !== 'undefined') {
                    //write file and add in db here
                    var date = new Date();
                    var timestamp = date.getTime();
                    await asyncFor(req.files, async (file, i) => {
                        const name_image = idTour + '_' + timestamp + '_' + i + '.jpg';
                        //optimize ảnh
                        const buffer_opz = await imagemin.buffer(file.buffer, {
                            plugins: [
                                imageminMozjpeg(),
                                imageminPngquant({ quality: '60' })
                            ]
                        })
                        fs.writeFile('public' + link_img.link_tour_img + name_image, buffer_opz, async (err) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                await tour_images.create({
                                    name: name_image,
                                    fk_tour: idTour
                                })
                            }
                        })
                    })
                    return res.status(200).json({ msg: 'Create successful' });
                }
                else {
                    return res.status(400).json({ msg: 'Param is invalid' });
                }
            }
            else {
                return res.status(400).json({ msg: 'Wrong id tour' });
            }
        }
        else {
            return res.status(400).json({ msg: 'Wrong id tour' });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err });
    }

}