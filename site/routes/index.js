var express = require('express');
var router = express.Router();

const authMdw = require('./../middlewares/auth');

const dController = require('./../controllers/dashboardController');
const mController = require('./../controllers/menuController');

//Menu to user
router.get('/', mController.indexExternal);

router.get('/dashboard', authMdw, dController.index);

module.exports = router;
