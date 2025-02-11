const express = require('express');
const { admin_authentication,authentication,check_auth } = require('./login_auth_controller');
const router = express.Router()

router.route('/systemauth').post(admin_authentication)
router.route('/auth').post(authentication)
router.route('/check_auth').post(check_auth)


module.exports = router;