var users = require('../controllers/users.server.controller.js');
var passport = require('passport');

module.exports = function(app) {
    app.route('/signup')
        .get(users.renderSignup)
        .post(users.signup);

    app.route('/signin')
        .get(users.renderSignin)
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true
        }));

    app.get('/oauth/facebook', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/signin',
        scope: ['email']
    }));
    app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: 'signin'
    }));
    
    app.get('/signout', users.signout);

    /*app.route('/users')
        .post(users.create)
        .get(users.list);

    app.route('/users/:userid')
        .get(users.read)
        .put(users.update)
        .delete(users.delete);*/

    app.param('userid', users.userById);
}