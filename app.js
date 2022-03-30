const express = require('express');
const createHttpErrors = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const connectFlash = require('connect-flash');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const connectEnsureLogin = require('connect-ensure-login');
const { roles } = require('./utils/constants');


const app = express();

//helps display executed request to whichever routes plus status code of request
app.use(morgan('dev'));

//initialize app engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//initializing the session
app.use(session({
    secret: process.env.SESSION_SECRET,
    //forces the session to be saved back to the store even
    //if the session was never modified during the request.
    resave: false,
    //forces a session that is Uninitialized to be saved to the store.
    saveUninitialized: false,
    cookie: {
        // secure:true,
        httpOnly: true,
        },
        store:MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        })
    })
);

//for passportjs: Authorization
app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.auth');

app.use((req, res, next)=> {
    res.locals.user = req.user
    next();
})

//connect flash
app.use(connectFlash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

//Routes
app.use('/', require('./routes/index.route'));
app.use('/auth', require('./routes/auth.route'));
app.use('/user', connectEnsureLogin.ensureLoggedIn({
    setReturnTo:'/auth/login'}), 
        require('./routes/user.route'));
        
app.use('/admin', 
connectEnsureLogin.ensureLoggedIn({ redirectTo: '/auth/login'}),
ensureAdmin,
require('./routes/admin.route'));

app.use('/trucks',ensureAdminParking, require('./routes/trucks.route'));

app.use('/taxis',ensureAdminParking,require('./routes/taxis.route'));

app.use('/tyre_clinic',ensureAdminTyres, require('./routes/tyre_clinic.route'));

app.use('/battery',ensureAdminBattery, require('./routes/battery.route'));

app.use('/coasters',ensureAdminParking, require('./routes/coasters.route'));

app.use('/cars',ensureAdminParking, require('./routes/cars.route'));

app.use('/bodas',ensureAdminParking, require('./routes/bodas.route'));


// 404 Handler
app.use((req, res, next) => {
    next(createHttpError.NotFound());
  });
  
  // Error Handler
  app.use((error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status);
    res.render('error_40x', { error });
  });

const PORT = process.env.PORT || 5000;

//connection to mongo db
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
    .then(() => {
        console.log('Connected!!');
        app.listen(PORT, () => console.log(`server running on port ${PORT}`));
    })
    .catch((err) => console.log(err.message));

function ensureAdmin (req, res, next){
    if(req.user.role === roles.admin) {
        next();
    } else {
        req.flash('warning', 'you are not authorized to see this route');
        res.redirect('/');
    }
}

function ensureAdminTyres (req, res, next){
    if(req.user.role === roles.admintyres || req.user.role === roles.admin) {
        next();
    } else {
        req.flash('warning', 'you are not authorized to see this route');
        res.redirect('/');
    }
}

function ensureAdminBattery (req, res, next){
    if(req.user.role === roles.adminbattery || req.user.role === roles.admin) {
        next();
    } else {
        req.flash('warning', 'you are not authorized to see this route');
        res.redirect('/');
    }
}

function ensureAdminParking (req, res, next){
    if(req.user.role === roles.adminparking || req.user.role === roles.admin) {
        next();
    } else {
        req.flash('warning', 'you are not authorized to see this route');
        res.redirect('/');
    }
}