exports.render = function(req, res) {
    console.log(req.session.lastVisit || "First visit!");

    req.session.lastVisit = new Date();

    res.render('index', {
        title: 'Hello World',
        user: JSON.stringify(req.user)
    });
};