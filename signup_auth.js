const express = require('express')

const { staff_signup,user_vendor_signup } = require('./signup_auth_controller');
const router = express.Router()

router.route('/staff_signup/').post(staff_signup)
router.route('/signup_auth').post(user_vendor_signup)

module.exports = router;