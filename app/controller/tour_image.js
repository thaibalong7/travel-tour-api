const db = require('../models');
const tour_images = db.tour_images;
const helper_add_link = require('../helper/add_full_link');

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