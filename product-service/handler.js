'use strict';

const { getProductById } = require("./handlers/getProductById");
const { getProducts } = require("./handlers/getProducts");
const { createProduct } = require("./handlers/createProduct"); 

module.exports.getProducts = getProducts;
module.exports.getProductById = getProductById;
module.exports.createProduct = createProduct;