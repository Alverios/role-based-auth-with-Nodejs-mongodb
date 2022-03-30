const router = require('express').Router();

router.get('/coasters', (req, res, next) => {
    res.render('coasters');
});
module.exports = router;