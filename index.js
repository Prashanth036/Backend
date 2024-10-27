const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const path = require('path');


const adminApp = require('./adminApp'); 
const userRoutes = require("./routes/userRoutes")



const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.REACT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/Imgstorage',  express.static(path.join(__dirname, 'Imgstorage')));


//admin sub-application
app.use('/admin', adminApp);

//user routes
app.use('/api', userRoutes);



db.sequelize.authenticate()
  .then(() => db.sequelize.sync({ force: false }))
  .then(() => {
    console.log('Connection has been established successfully.');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;
