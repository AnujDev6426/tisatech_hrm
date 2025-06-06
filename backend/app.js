const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const { errorHandler } = require('./middleware');
const authRouter = require('./routes/auth.routes'); 
const routes = require('./routes')
const pdfCreator = require('pdf-creator-node');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/docs', express.static('docs'))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRouter); 
app.use('/dash', routes); 

app.get('/generate-pdf', (req, res) => {
   console.log(new Date().getFullYear())
 });
  
app.use(errorHandler);
module.exports = app;
