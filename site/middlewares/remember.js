const db = require('../database/models');

module.exports = async(req, res, next) => {

    //cookie sencilla de mantenerme logeado
    if (req.cookies['_rememberEmail_']) {
        //TO_DO verificar el token
        //cambiar al token...
        let user = await db.User.findOne({ where: { email: req.cookies['_rememberEmail_'] } });

        res.locals.logeado = true;
        res.locals.user = user;
        req.session.logeado = true;
        req.session.user = user;
    }

    next();
}