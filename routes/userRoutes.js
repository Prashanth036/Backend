
const express = require('express');
const router = express.Router();

const resourceController=require("../controllers/ResourceController");





router.get('/resources/:id', resourceController.getPainData);
router.get('/resources', resourceController.getPainTypes);




module.exports = router