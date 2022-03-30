const router = require('express').Router();

router.get('/tyre_clinic', (req, res, next) => {
    res.render('tyre_clinic');
});
module.exports = router;