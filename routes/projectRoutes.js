const express = require('express')
const router = express.Router()


//admin login 
const {registerAdmin,loginAdmin} = require('../Controller/authenticationController');
router.get('/admin/login',loginAdmin);
router.get('/admin/register',registerAdmin);




module.exports = router;