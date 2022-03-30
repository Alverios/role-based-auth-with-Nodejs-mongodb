const router = require('express').Router();

router.get('/battery', (req, res, next) => {
    res.render('battery');
});
module.exports = router;