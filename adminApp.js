const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const adminApp = express();


const adminRoutes = require('./routes/adminRoutes'); 




const corsOptions = {
  origin: process.env.REACT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};


adminApp.use(express.json());
adminApp.use(express.urlencoded({ extended: true }));
adminApp.use(cookieParser());
adminApp.use(cors(corsOptions));

// adminApp.use(authenticateAdmin);

 
 adminApp.use('/', adminRoutes);



adminApp.on('mount', function (parent) {
  // console.log('Admin Mounted');
  // console.log(parent); 
});

module.exports = adminApp;
