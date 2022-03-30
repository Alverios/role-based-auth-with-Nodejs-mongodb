const router = require('express').Router();

router.get('/bodas', (req, res, next) => {
    res.render('bodas');
});
module.exports = router;