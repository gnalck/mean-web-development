module.exports = {
    db: 'mongodb://localhost/mean-book-test',
    sessionSecret: 'secret',
    viewEngine: 'ejs',
    facebook: {
        clientId: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/oauth/facebook/callback'
    }
};