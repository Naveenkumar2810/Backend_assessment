const express = require('express');
const multer = require('multer');
const path = require('path');
const { getproducts, getsearchedproducts,get_user_vendor_staff_details,add_products,get_all_user_vendor_staff_details } = require('./detailscontroller');
const router = express.Router()

const storage = multer.memoryStorage({ storage: multer.memoryStorage()}); // Store files in memory (you can also save them to disk)
const upload = multer({ storage: storage });


router.route('/addproduct').post(upload.single('Image'),add_products)
router.route('/getproducts').post(getproducts)
router.route('/searchproducts/:id').get(getsearchedproducts)
router.route('/getdetails').post(get_user_vendor_staff_details)
router.route('/getlist_details').post(get_all_user_vendor_staff_details)


module.exports = router;

