const Sequelize = require('sequelize');

const sequelize = new Sequelize('library management system', 'root', '', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;