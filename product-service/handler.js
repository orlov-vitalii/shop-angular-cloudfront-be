'use strict';

const { getProductById } = require("./handlers/getProductById");
const { getProducts } = require("./handlers/getProducts");

module.exports.getProducts = getProducts;
module.exports.getProductById = getProductById;