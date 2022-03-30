const router = require('express').Router();
const User = require('../models/user.model');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const connectEnsure = require('connect-ensure-login');

router.get('/login',
    connectEnsure.ensureLoggedOut({ redirectTo: '/' }),
    async (req, res, next) => {
        res.render('login');
    });

router.post('/login',
    connectEnsure.ensureLoggedOut({ redirectTo: '/' }),
    passport.authenticate('local', {
        // successRedirect: "/",
        successReturnToOrRedirect: "/",
        failureRedirect: "/auth/login",
        failureFlash: true,
    })
);

router.get('/register',
    connectEnsure.ensureLoggedOut({ redirectTo: '/' }),
    async (req, res, next) => {
        res.render('register');
    });

router.post('/register',
    connectEnsure.ensureLoggedOut({ redirectTo: '/' }),
    [
        //form input validation
        body('email')
            .trim()
            .isEmail()
            .withMessage('Email must be a Valid Email Format')
            .normalizeEmail()
            .toLowerCase(),
        body('password')
            .trim()
            .isLength(8)
            .withMessage('Password length is too short, min 8 characters required'),
        body('password2').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password do not match');
            }
            return true;
        }),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors.array().forEach(error => {
                    req.flash('error', error.msg)
                });
                res.render('register', {
                    email: req.body.email,
                    messages: req.flash(),
                });
                return;
            }

            //checking if user email already exists before registering a new user!
            const { email } = req.body;
            const doesExist = await User.findOne({ email });
            if (doesExist) {
                res.redirect('/auth/register');
                return;
            }
            const user = new User(req.body);
            await user.save();
            req.flash('success', `${user.email} registered Succesfully,Login Now!`);
            res.redirect('/auth/login');
        } catch (error) {
            next(error);
        }

    });

router.get('/logout', 
connectEnsure.ensureLoggedIn({ redirectTo: '/' }),
async (req, res, next) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;


//protecting Routes
// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         next();
//     } else {
//         res.redirect('/auth/login');
//     }
// }

// function ensureNOTAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         res.redirect('back');
//     } else {
//         next();
//     }
// }
