const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'products';

const Product = sequelize.define('Product', {
  title: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.FLOAT,
  },
}, { tableName });

module.exports = { Product };
