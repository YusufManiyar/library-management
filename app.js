const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const sequelize = require('./utlis/data-config.js')
const router = require('./routes/main.js')

const app = express();
const port = 4000;

app.use(cors())
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/', router)

// Start the server

sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
})
.catch(err => {
  console.log(err);
});
