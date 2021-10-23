const tokenService = require('./tokenService');

module.exports = {
    minutesPerSession: 600000,
    restartSessionTime: function(req) {
        let date = new Date(Date.now() + this.minutesPerSession);

        req.session.cookie.expires = date;
    },
    loginUser: function(req, res, user) {
        let date = new Date(Date.now() + this.minutesPerSession);

        req.session.cookie.expires = date;
        req.session.cookie.maxAge = this.minutesPerSession;

        res.locals.logeado = true;
        res.locals.user = user;
        req.session.logeado = true;
        req.session.user = user;

    },
    rememberUser: function(user) {

    },
    logOutSession: function(req, res) {
        if (req.session) {
            let date = new Date(Date.now() - 100);
            req.session.cookie.expires = date;
            req.session.cookie.maxAge = -100;
        }

        res.redirect('/login');
    }
}