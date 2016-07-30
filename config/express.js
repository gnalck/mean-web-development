var express = require('express');
var morgan = require('morgan');
var compress = require('compress');
var bodyParse = require('body-parser');
var methodOverride = require('method-override');

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

    require('../app/routes/index.server.routes.js')(app);
    return app;
}