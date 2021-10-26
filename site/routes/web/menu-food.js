var express = require('express');
var router = express.Router();

const authMdw = require('./../../middlewares/auth');

const controller = require('./../../controllers/menuController');


router.get('/', authMdw, controller.index);

module.exports = router;
