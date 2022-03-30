const router = require('express').Router();

router.get('/cars', (req, res, next) => {
    res.render('cars');
});
module.exports = router;