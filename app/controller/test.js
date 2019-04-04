const db = require('../models');

exports.testAPI = (req, res) => {
    try {
        const query = "select tours.*, tour_turns.id as `tours.tour_turns.id`, tour_turns.start_date as `tours.tour_turns.start_date` " +
            "from tours LEFT JOIN tour_turns on tours.id = tour_turns.fk_tour and tour_turns.status = 'public'"
        console.log(query)
        db.sequelize.query(query).then(result => {
            return res.status(400).json({ data: result });
        })
        // db.tour_turns.findAll().then(result => {
        //         return res.status(400).json({ data: result });
        //     })
    } catch (error) {
        return res.status(400).json({ msg: error.toString() });
    }
}