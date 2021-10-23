const loginService = require('../services/loginService');

module.exports = (req, res, next) => {

    res.locals.user = null;
    res.locals.logeado = false;

    if (req.session.user) {
        res.locals.logeado = true;
        res.locals.user = req.session.user;
        loginService.restartSessionTime(req);
    }

    next();
}