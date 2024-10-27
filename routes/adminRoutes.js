const express = require('express');
const router = express.Router();

const adminController=require("../controllers/AdminControllers/AdminAuthController");
const { adminAuthenticateMiddleware } = require('../middleware/isAdminAuthMiddleware');
const resourceController=require("../controllers/ResourceController");
const upload=require("../fileupload");



router.post("/create",adminController.createAdmin);
router.post("/login",adminController.loginAdmin);
router.post('/add_resource',
    // adminAuthenticateMiddleware,
    upload.single('imglink'), resourceController.createPainData);


module.exports = router