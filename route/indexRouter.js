import express from 'express';
import moment from 'moment';


let router = express.Router();
router.get('/', async function(req, res) {
    let title = 'Nodejs-Template '
    let today = new moment().format('YYYY-MM-DD HH:mm:ss')
    res.render('index', {
        today,
        title,
        user
    });
});

module.exports = router;