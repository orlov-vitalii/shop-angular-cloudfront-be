'use strict';

const { getProductById } = require("./handlers/getProductById");
const { getProducts } = require("./handlers/getProducts");
const { createProduct } = require("./handlers/createProduct");
const { catalogBatchProcess } = require("./handlers/catalogBatchProcess");

module.exports.getProducts = getProducts;
module.exports.getProductById = getProductById;
module.exports.createProduct = createProduct;
module.exports.catalogBatchProcess = catalogBatchProcess;