const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// const orderRoutes = require('./routes/order');
// const ordersRoutes = require('./routes/orders');
// const postsRoutes = require('./routes/posts')
const ordersRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');

const app = express();

mongoose.set('useCreateIndex', true);
mongoose.connect(
  'mongodb+srv://Zohar:'+
  process.env.MONGO_ATLAS_PW +
  '@cluster0-ge5lh.mongodb.net/tracking-app?retryWrites=true',
  {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/user', userRoutes);
app.use('/api/orders', ordersRoutes);
//app.use('/api/posts', postsRoutes);

module.exports = app;
