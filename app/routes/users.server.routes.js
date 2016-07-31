var users = require('../controllers/users.server.controller.js');

module.exports = function(app) {
    app.route('/users')
        .post(users.create)
        .get(users.list);

    app.route('/users/:userid')
        .get(users.read)
        .put(users.update);

    app.param('userid', users.userById);
}