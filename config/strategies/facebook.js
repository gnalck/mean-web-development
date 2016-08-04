var passport = require('passport');
var url = require('url');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config.js');
var users = require('../../app/controllers/users.server.controller');

module.exports = function () {
    passport.use(new FacebookStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['emails', 'id', 'name', 'displayName'],
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;
        var providerUserProfile = {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            username: profile.emails[0].value,
            provider: 'facebook',
            providerId: profile.id,
            providerData: providerData
        };

        console.log(providerUserProfile.firstName);

        users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};