var config = require('./config');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParse = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var favicon = require('serve-favicon');
var passport = require('passport');
var flash = require('connect-flash');

module.exports = function() {
    var app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_END === 'production') {
        app.use(compress());
    }

    app.use(bodyParse.urlencoded({
        extended: true
    }));
    app.use(bodyParse.json());
    app.use(methodOverride());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);

    // we want to look for static files last, since it is a file i/o op
    app.use(express.static('./public'));
    app.use(favicon('./public/img/favicon.ico'));

    return app;
}