// expenseModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../utlis/data-config.js')

const Book = sequelize.define('Book', {
  id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  takenDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  expectedReturnDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  actualReturnDate: {
    type: DataTypes.DATE
  },
  fine: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isFinePaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isReturned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Book;
