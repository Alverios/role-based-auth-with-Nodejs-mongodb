const router = require('express').Router();

router.get('/trucks', (req, res, next) => {
    res.render('trucks');
});
module.exports = router;