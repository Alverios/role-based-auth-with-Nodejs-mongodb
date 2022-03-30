const router = require('express').Router();

router.get('/taxis', (req, res, next) => {
    res.render('taxis');
});
module.exports = router;